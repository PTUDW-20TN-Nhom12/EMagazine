import { SupabaseDataSource } from "../data_source";
import { Category } from "../models/Category";
import { IsNull } from "typeorm";

export class CategoryController {
    private categoryRepository = SupabaseDataSource.getRepository(Category);

    async createCategory(name: string, description: string, parentId: number | null): Promise<Category> {
        const category = new Category();
        category.name = name;
        category.description = description;
        if (parentId) {
            const parentCategory = await this.categoryRepository.findOneBy({ id: parentId });
            if (!parentCategory) {
                throw new Error(`Parent category with ID ${parentId} not found.`);
            }
            category.parent = parentCategory;
        }

        try {
            return await this.categoryRepository.save(category);
        } catch (error) {
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            return await this.categoryRepository.find();
        } catch (error) {
            throw new Error(`Failed to retrieve categories: ${error.message}`);
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
            throw new Error(`Failed to retrieve categories: ${error.message}`);
        }
    }

    async getCategoryById(id: number): Promise<Category> {
        try {
            return await this.categoryRepository.findOneBy({ id: id });
        } catch (error) {
            throw new Error(`Failed to retrieve category: ${error.message}`);
        }
    }

    async getCategoryByName(name: string): Promise<Category> {
        try {
            return await this.categoryRepository.findOneBy({ name: name });
        } catch (error) {
            throw new Error(`Failed to retrieve category: ${error.message}`);
        }
    }

    async updateCategory(id: number, name: string, description: string, parentId: number | null): Promise<Category> {
        try {
            const category = await this.categoryRepository.findOneBy({ id: id });
            if (!category) {
                throw new Error(`Category with ID ${id} not found.`);
            }
            category.name = name;
            category.description = description;
            if (parentId) {
                const parentCategory = await this.categoryRepository.findOneBy({ id: parentId });
                if (!parentCategory) {
                    throw new Error(`Parent category with ID ${parentId} not found.`);
                }
                category.parent = parentCategory;
            } else {
                category.parent = null;
            }
            return await this.categoryRepository.save(category);
        } catch (error) {
            throw new Error(`Failed to update category: ${error.message}`);
        }
    }

    async deleteCategory(id: number): Promise<void> {
        try {
            const category = await this.categoryRepository.findOneBy({ id: id });
            if (!category) {
                throw new Error(`Category with ID ${id} not found.`);
            }
            await this.categoryRepository.remove(category);
        } catch (error) {
            throw new Error(`Failed to delete category: ${error.message}`);
        }
    }

    async clearCategories(): Promise<void> {
        try {
            await this.categoryRepository.delete({});
        } catch (error) {
            throw new Error(`Failed to clear categories: ${error.message}`);
        }
    }
}