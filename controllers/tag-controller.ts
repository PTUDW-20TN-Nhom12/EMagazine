import { SupabaseDataSource } from "../models/data_source";
import { Tag } from "../models/tag";

export class TagController {
    private tagRepository = SupabaseDataSource.getRepository(Tag);

    async createTag(name: string, description: string): Promise<Tag> {
        const tag = new Tag();
        tag.name = name;
        tag.description = description;

        try {
            return await this.tagRepository.save(tag);
        } catch (error) {
            console.error(`Failed to create tag: ${error.message}`);
            return null; 
        }
    }

    async getAllTags(): Promise<Tag[]> {
        try {
            return await this.tagRepository.find();
        } catch (error) {
            console.error(`Failed to retrieve tags: ${error.message}`);
            return null; 
        }
    }

    async getTagById(id: number): Promise<Tag> {
        try {
            return await this.tagRepository.findOneBy({ id: id });
        } catch (error) {
            console.error(`Failed to retrieve tag: ${error.message}`);
            return null; 
        }
    }

    async updateTag(id: number, name: string, description: string): Promise<Tag> {
        try {
            const tag = await this.tagRepository.findOneBy({ id: id });
            if (!tag) {
                console.error(`Tag with ID ${id} not found.`);
                return null; 
            }
            tag.name = name;
            tag.description = description;
            return await this.tagRepository.save(tag);
        } catch (error) {
            console.error(`Failed to update tag: ${error.message}`);
            return null; 
        }
    }

    async deleteTag(id: number): Promise<void> {
        try {
            const tag = await this.tagRepository.findOneBy({ id: id });
            if (!tag) {
                console.error(`Tag with ID ${id} not found.`);
                return null; 
            }
            await this.tagRepository.remove(tag);
        } catch (error) {
            console.error(`Failed to delete tag: ${error.message}`);
            return null; 
        }
    }

    async clearTags(): Promise<void> {
        try {
            await this.tagRepository.delete({});
        } catch (error) {
            console.error(`Failed to clear categories: ${error.message}`);
            return null; 
        }
    }
}