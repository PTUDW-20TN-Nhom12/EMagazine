import { AppDataSource } from "../data_source";
import { Article } from "../models/Article";
import { User } from "../models/User";
import { Category } from "../models/Category";
import { Like } from "typeorm";

export class ArticleController {
    private articleRepository = AppDataSource.getRepository(Article);

    async createArticle(
        // author: User,
        category: Category,
        title: string,
        short_description: string,
        content: string,
        thumbnail_url: string,
        is_premium: boolean
    ): Promise<Article> {
        const article = new Article();
        // article.author = author;
        article.category = category;
        article.title = title;
        article.short_description = short_description;
        article.content = content;
        article.thumbnail_url = thumbnail_url;
        article.is_premium = is_premium;

        try {
            return await this.articleRepository.save(article);
        } catch (error) {
            throw new Error(`Failed to create article: ${error.message}`);
        }
    }

    async getArticles(query?): Promise<[Article[], number]> {
        const PAGESIZE = 6;
        const page = query.page || 0;
        const keyword = query.keyword || '';

        try {
            return await this.articleRepository.findAndCount(
                {
                    where: { title: Like('%' + keyword + '%') }, order: { title: "ASC" },
                    take: PAGESIZE,
                    skip: (page - 1) * PAGESIZE
                }
            );
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async getArticleById(id: number): Promise<Article> {
        try {
            return await this.articleRepository.findOneBy({ id: id });
        } catch (error) {
            throw new Error(`Failed to retrieve article: ${error.message}`);
        }
    }

    async updateArticle(
        id: number,
        // author: User,
        category: Category,
        title: string,
        short_description: string,
        content: string,
        thumbnail_url: string,
        is_premium: boolean
    ): Promise<Article> {
        try {
            const article = await this.articleRepository.findOneBy({ id: id });
            if (!article) {
                throw new Error(`Article with ID ${id} not found.`);
            }
            // article.author = author;
            article.category = category;
            article.title = title;
            article.short_description = short_description;
            article.content = content;
            article.thumbnail_url = thumbnail_url;
            article.is_premium = is_premium;
            return await this.articleRepository.save(article);
        } catch (error) {
            throw new Error(`Failed to update article: ${error.message}`);
        }
    }

    async deleteArticle(id: number): Promise<void> {
        try {
            const article = await this.articleRepository.findOneBy({ id: id });
            if (!article) {
                throw new Error(`Article with ID ${id} not found.`);
            }
            await this.articleRepository.remove(article);
        } catch (error) {
            throw new Error(`Failed to delete article: ${error.message}`);
        }
    }

    async clearArticles(): Promise<void> {
        try {
            await this.articleRepository.clear();
        } catch (error) {
            throw new Error(`Failed to clear articles: ${error.message}`);
        }
    }
}