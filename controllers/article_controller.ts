import { SupabaseDataSource } from "../data_source";
import { Article } from "../models/Article";
import { User } from "../models/User";
import { Tag } from "../models/Tag";
import { Category } from "../models/Category";
import { Like } from "typeorm";

export class ArticleController {
    private articleRepository = SupabaseDataSource.getRepository(Article);

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
        article.tags = [];

        try {
            return await this.articleRepository.save(article);
        } catch (error) {
            throw new Error(`Failed to create article: ${error.message}`);
        }
    }

    async getHotArticles(number = 4): Promise<Article[]> {
        try {
            return await this.articleRepository.find({
                relations: {
                    category: true,
                },
                take: number,
            });
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async getLatestArticles(number = 10): Promise<Article[]> {
        try {
            return await this.articleRepository.find({
                relations: {
                    category: true,
                },
                take: number,
            });
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async getMostViewsArticles(number = 10): Promise<Article[]> {
        try {
            return await this.articleRepository.find({
                relations: {
                    category: true,
                },
                take: number,
            });
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async getMostViewByCategoryArticles(number = 10): Promise<Article[]> {
        try {
            return await this.articleRepository.find({
                relations: {
                    category: true,
                },
                take: number,
            });
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async addTag(article_id: number, tag_id:number) {
        try {
            let article = await this.getArticleById(article_id);
            let tag = await SupabaseDataSource.getRepository(Tag).findOneBy({id: tag_id});
            article.tags.push(tag);
            await this.articleRepository.save(article);
        } catch (error) {
            throw new Error(`Failed to add tag: ${error.message}`);
        }
    }

    async getArticlesByCategoryID(category_id: number, page: number, page_size: number = 6): Promise<Article[]> {
        try {
            return await this.articleRepository
                        .createQueryBuilder("articles")
                        .leftJoinAndSelect("articles.category", "category")
                        .leftJoinAndSelect("articles.tags", "tag")
                        .where("category.id = :category_id", { category_id: category_id })
                        .orderBy('articles.id', 'ASC')
                        .skip(page * page_size)
                        .take(page_size)
                        .getMany();
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async countArticlesByCategoryID(category_id: number): Promise<number> {
        try {
            return await this.articleRepository
                        .createQueryBuilder("articles")
                        .leftJoinAndSelect("articles.category", "category")
                        .leftJoinAndSelect("articles.tags", "tag")
                        .where("category.id = :category_id", { category_id: category_id })
                        .getCount();
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async getArticlesByTagID(tag_id: number, page: number, page_size: number = 6): Promise<Article[]> {
        try {
            return await this.articleRepository
                        .createQueryBuilder("articles")
                        .leftJoinAndSelect("articles.category", "category")
                        .leftJoinAndSelect("articles.tags", "tag")
                        .where("tag.id = :tag_id", { tag_id: tag_id })
                        .orderBy('articles.id', 'ASC')
                        .skip(page * page_size)
                        .take(page_size)
                        .getMany();  
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async countArticlesByTagID(tag_id: number): Promise<number> {
        try {
            return await this.articleRepository
                        .createQueryBuilder("articles")
                        .leftJoinAndSelect("articles.category", "category")
                        .leftJoinAndSelect("articles.tags", "tag")
                        .where("tag.id = :tag_id", { tag_id: tag_id })
                        .getCount();
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async getSearchResults(search_query: string, page: number, page_size: number = 6) {
        try {
            let results = await this.articleRepository.query(`SELECT id, ts_rank(to_tsvector('english', title || ' ' || short_description || ' ' || content), to_tsquery('english', '${search_query}')) AS rank
            FROM articles
            WHERE (to_tsvector('english', title || ' ' || short_description || ' ' || content) @@ to_tsquery('english', '${search_query}')) LIMIT 20`);
            let ret = [];
            results = results.slice(page * page_size, (page + 1) * page_size);
            for (let result of results) {
                let article = await this.getArticleById(result.id);
                ret.push(article);
            }
            return ret;
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async countSearchResults(search_query: string) {
        try {
            return await this.articleRepository.query(`SELECT COUNT(*)
            FROM articles 
            WHERE (to_tsvector('english', title || ' ' || short_description || ' ' || content) @@ to_tsquery('english', '${search_query}'))`)
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

    async getArticleById(id: number): Promise<Article> {
        try {
            return await this.articleRepository.findOne({
                relations: {
                    category: true,
                    tags: true,
                },
                where: {
                    id: id,
                },
            });
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
            await this.articleRepository.delete({});
        } catch (error) {
            throw new Error(`Failed to clear articles: ${error.message}`);
        }
    }
}