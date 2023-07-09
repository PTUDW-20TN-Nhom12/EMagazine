import { SupabaseDataSource } from "../models/data_source";
import { Category } from "../models/category";
import { ChildEntity, IsNull } from "typeorm";

export class CategoryController {
    private categoryRepository = SupabaseDataSource.getRepository(Category);

    async createCategory(name: string, description: string, parentId: number | null): Promise<Category> {
        const category = new Category();
        category.name = name;
        category.description = description;
        if (parentId) {
            const parentCategory = await this.categoryRepository.findOneBy({ id: parentId });
            if (!parentCategory) {
                console.error(`Parent category with ID ${parentId} not found.`);
                return null;
            }
            category.parent = parentCategory;
        }

        try {
            return await this.categoryRepository.save(category);
        } catch (error) {
            console.error(`Failed to create category: ${error.message}`);
            return null;
        }
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            return await this.categoryRepository.find();
        } catch (error) {
            console.error(`Failed to retrieve categories: ${error.message}`);
            return null;
        }
    }

    async getAllMainCategories(): Promise<Category[]> {
        try {
            return await this.categoryRepository.find({
                relations: {
                    children: true,
                    parent: true,
                },
                where: {
                    parent: IsNull(),
                },
                order: {
                    name: "ASC",
                },
            }
            );
        } catch (error) {
            console.error(`Failed to retrieve categories: ${error.message}`);
            return null;
        }
    }

    async getCategoryById(id: number): Promise<Category> {
        try {
            return await this.categoryRepository.findOne({
                    where: {
                        id: id,
                    },
                    relations: {
                        children: true,
                    }
                });
        } catch (error) {
            console.error(`Failed to retrieve category: ${error.message}`);
            return null;
        }
    }

    async getCategoryByName(name: string): Promise<Category> {
        try {
            return await this.categoryRepository.findOneBy({ name: name });
        } catch (error) {
            console.error(`Failed to retrieve category: ${error.message}`);
            return null;
        }
    }

    async updateCategory(id: number, name: string, description: string, parentId: number | null): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOneBy({ id: id });
            if (!category) {
                console.error(`Category with ID ${id} not found.`);
                return null;
            }
            category.name = name;
            category.description = description;
            if (parentId) {
                const parentCategory = await this.categoryRepository.findOneBy({ id: parentId });
                if (!parentCategory) {
                    console.error(`Parent category with ID ${parentId} not found.`);
                    return null;
                }
                category.parent = parentCategory;
            } else {
                category.parent = null;
            }
            return await this.categoryRepository.save(category);
        } catch (error) {
            console.error(`Failed to update category: ${error.message}`);
            return null;
        }
    }

    async deleteCategory(id: number): Promise<void> {
        try {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: id,
                },
                relations: {
                    children: true,
                }
            });
            if (!category) {
                console.error(`Category with ID ${id} not found.`);
                return null;
            }
            if (category.children.length > 0) {
                for (const child of category.children) {
                    await this.categoryRepository.remove(child);
                }
            }
            await this.categoryRepository.remove(category);
        } catch (error) {
            console.error(`Failed to delete category: ${error.message}`);
            return null;
        }
    }

    async clearCategories(): Promise<void> {
        try {
            await this.categoryRepository.delete({});
        } catch (error) {
            console.error(`Failed to clear categories: ${error.message}`);
            return null;
        }
    }
}