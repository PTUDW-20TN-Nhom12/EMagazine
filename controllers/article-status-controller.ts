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
            throw new Error(`Failed to create article status: ${error.message}`);
        }
    }

    async getAllArticleStatuses(): Promise<ArticleStatus[]> {
        try {
            return await this.articleStatusRepository.find();
        } catch (error) {
            throw new Error(`Failed to retrieve article statuses: ${error.message}`);
        }
    }

    async getArticleStatusById(id: number): Promise<ArticleStatus> {
        try {
            return await this.articleStatusRepository.findOneBy({ id: id });
        } catch (error) {
            throw new Error(`Failed to retrieve article status: ${error.message}`);
        }
    }

    async updateArticleStatus(id: number, status: StatusList, note?: string): Promise<ArticleStatus> {
        try {
            const articleStatus = await this.articleStatusRepository.findOneBy({ id: id });
            if (!articleStatus) {
                throw new Error(`Article status with ID ${id} not found.`);
            }
            articleStatus.status = status;
            articleStatus.note = note;
            return await this.articleStatusRepository.save(articleStatus);
        } catch (error) {
            throw new Error(`Failed to update article status: ${error.message}`);
        }
    }

    async deleteArticleStatus(id: number): Promise<void> {
        try {
            const articleStatus = await this.articleStatusRepository.findOneBy({ id: id });
            if (!articleStatus) {
                throw new Error(`Article status with ID ${id} not found.`);
            }
            await this.articleStatusRepository.remove(articleStatus);
        } catch (error) {
            throw new Error(`Failed to delete article status: ${error.message}`);
        }
    }

    async clearArticleStatuses(): Promise<void> {
        try {
            await this.articleStatusRepository.delete({});
        } catch (error) {
            throw new Error(`Failed to clear article statuses: ${error.message}`);
        }
    }
}