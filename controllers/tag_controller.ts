import { SupabaseDataSource } from "../data_source";
import { Tag } from "../models/Tag";

export class TagController {
    private tagRepository = SupabaseDataSource.getRepository(Tag);

    async createTag(name: string, description: string): Promise<Tag> {
        const tag = new Tag();
        tag.name = name;
        tag.description = description;

        try {
            return await this.tagRepository.save(tag);
        } catch (error) {
            throw new Error(`Failed to create tag: ${error.message}`);
        }
    }

    async getAllTags(): Promise<Tag[]> {
        try {
            return await this.tagRepository.find();
        } catch (error) {
            throw new Error(`Failed to retrieve tags: ${error.message}`);
        }
    }

    async getTagById(id: number): Promise<Tag> {
        try {
            return await this.tagRepository.findOneBy({ id: id });
        } catch (error) {
            throw new Error(`Failed to retrieve tag: ${error.message}`);
        }
    }

    async updateTag(id: number, name: string, description: string): Promise<Tag> {
        try {
            const tag = await this.tagRepository.findOneBy({ id: id });
            if (!tag) {
                throw new Error(`Tag with ID ${id} not found.`);
            }
            tag.name = name;
            tag.description = description;
            return await this.tagRepository.save(tag);
        } catch (error) {
            throw new Error(`Failed to update tag: ${error.message}`);
        }
    }

    async deleteTag(id: number): Promise<void> {
        try {
            const tag = await this.tagRepository.findOneBy({ id: id });
            if (!tag) {
                throw new Error(`Tag with ID ${id} not found.`);
            }
            await this.tagRepository.remove(tag);
        } catch (error) {
            throw new Error(`Failed to delete tag: ${error.message}`);
        }
    }

    async clearTags(): Promise<void> {
        try {
            await this.tagRepository.delete({});
        } catch (error) {
            throw new Error(`Failed to clear categories: ${error.message}`);
        }
    }
}