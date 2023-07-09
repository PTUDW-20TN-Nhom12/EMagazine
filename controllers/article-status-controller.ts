import { ArticleStatus, StatusList } from "../models/article-status";
import { User } from "../models/user";
import { Article } from "../models/article";
import { SupabaseDataSource } from "../models/data_source";

export class ArticleStatusController {
    private articleStatusRepository = SupabaseDataSource.getRepository(ArticleStatus);

    async createArticleStatus(article: Article, performer: User, status: StatusList, time: Date, note: string): Promise<ArticleStatus> {
        const articleStatus = new ArticleStatus();
        articleStatus.article = article;
        articleStatus.performer = performer;
        articleStatus.status = status;
        articleStatus.note = note;
        articleStatus.time = time;

        try {
            return await this.articleStatusRepository.save(articleStatus);
        } catch (error) {
            console.error(`Failed to create article status: ${error.message}`);
            return null; 
        }
    }

    async getAllArticleStatuses(): Promise<ArticleStatus[]> {
        try {
            return await this.articleStatusRepository.find();
        } catch (error) {
            console.error(`Failed to retrieve article statuses: ${error.message}`);
            return null; 
        }
    }

    async getArticleStatusById(id: number): Promise<ArticleStatus> {
        try {
            return await this.articleStatusRepository.findOneBy({ id: id });
        } catch (error) {
            console.error(`Failed to retrieve article status: ${error.message}`);
            return null; 
        }
    }

    async updateArticleStatus(id: number, status: StatusList, note?: string): Promise<ArticleStatus> {
        try {
            const articleStatus = await this.articleStatusRepository.findOneBy({ id: id });
            if (!articleStatus) {
                console.error(`Article status with ID ${id} not found.`);
                return null; 
            }
            articleStatus.status = status;
            articleStatus.note = note;
            return await this.articleStatusRepository.save(articleStatus);
        } catch (error) {
            console.error(`Failed to update article status: ${error.message}`);
            return null; 
        }
    }

    async deleteArticleStatus(id: number): Promise<void> {
        try {
            const articleStatus = await this.articleStatusRepository.findOneBy({ id: id });
            if (!articleStatus) {
                console.error(`Article status with ID ${id} not found.`);
                return null; 
            }
            await this.articleStatusRepository.remove(articleStatus);
        } catch (error) {
            console.error(`Failed to delete article status: ${error.message}`);
            return null; 
        }
    }

    async clearArticleStatuses(): Promise<void> {
        try {
            await this.articleStatusRepository.delete({});
        } catch (error) {
            console.error(`Failed to clear article statuses: ${error.message}`);
            return null; 
        }
    }
}