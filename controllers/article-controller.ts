import {SupabaseDataSource} from "../models/data_source";
import {Article} from "../models/article";
import {User} from "../models/user";
import {Tag} from "../models/tag";
import {Category} from "../models/category";
import {Like} from "typeorm";
import moment from "moment";

export class ArticleController {
    private articleRepository = SupabaseDataSource.getRepository(Article);

    async createArticle(
        // author: User,
        category: Category,
        title: string,
        short_description: string,
        content: string,
        thumbnail_url: string,
        timestamp: string,
        is_premium: boolean
    ): Promise<Article> {
        const article = new Article();
        // article.author = author;
        article.category = category;
        article.title = title;
        article.short_description = short_description;
        article.content = content;
        article.thumbnail_url = thumbnail_url;
        article.date_created = moment(timestamp).toDate();
        article.is_premium = is_premium;
        article.tags = [];

        try {
            return await this.articleRepository.save(article);
        } catch (error) {
            console.error(`Failed to create article: ${error.message}`);
            return null;
        }
    }

    async getHotArticles(is_premium, number = 4): Promise<Article[]> {
        try {
            let results = await this.articleRepository.query(`SELECT "articleId", COUNT(*) AS view_count
            FROM views_log
            WHERE time >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY "articleId"
            ORDER BY view_count DESC
            LIMIT $1`, [number]); 
            let ret = [];
            for (let result of results) {
                let article = await this.getArticleById(result.articleId);
                ret.push(article);
            }
            return ret;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async getLatestArticles(is_premium, number = 10): Promise<Article[]> {
        try {
            return await this.articleRepository.find({
                relations: {
                    category: true,
                },
                order: {
                    date_created: 'DESC',
                },
                take: number,
                cache: true,
            });
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async getMostViewsArticles(is_premium, number = 10): Promise<Article[]> {
        try {
            let results = await this.articleRepository.query(`SELECT "articleId", COUNT(*) AS view_count
            FROM views_log
            GROUP BY "articleId"
            ORDER BY view_count DESC
            LIMIT $1`, [number]);
            let ret = [];
            for (let result of results) {
                let article = await this.getArticleById(result.articleId);
                ret.push(article);
            }
            return ret;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async getMostViewByCategoryArticles(is_premium, number = 10): Promise<Article[]> {
        try {
            let results = await this.articleRepository.query(`SELECT a."categoryId", a.id, COUNT(v."articleId") AS views
            FROM articles a
            JOIN views_log v ON a.id = v."articleId"
            GROUP BY a."categoryId", a.id
            HAVING COUNT(v."articleId") = (
              SELECT MAX(views)
              FROM (
                SELECT b."categoryId", b.id, COUNT(vv."articleId") AS views
                FROM articles b
                JOIN views_log vv ON b.id = vv."articleId" AND b."categoryId" = a."categoryId"
                GROUP BY b."categoryId", b.id
              ) subquery
            )
            ORDER BY views DESC
            LIMIT $1`, [number]);  
            let ret = [];
            for (let result of results) {
                let article = await this.getArticleById(result.id);
                ret.push(article);
            }
            return ret;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async addTag(article_id: number, tag_id:number) {
        try {
            let article = await this.getArticleById(article_id);
            let tag = await SupabaseDataSource.getRepository(Tag).findOneBy({id: tag_id});
            article.tags.push(tag);
            await this.articleRepository.save(article);
        } catch (error) {
            console.error(`Failed to add tag: ${error.message}`);
            return null;
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
                        .cache(true)
                        .getMany();
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async countArticlesByCategoryID(category_id: number): Promise<number> {
        try {
            return await this.articleRepository
                        .createQueryBuilder("articles")
                        .leftJoinAndSelect("articles.category", "category")
                        .leftJoinAndSelect("articles.tags", "tag")
                        .where("category.id = :category_id", { category_id: category_id })
                        .cache(true)
                        .getCount();
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
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
                        .cache(true)
                        .getMany();  
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async countArticlesByTagID(tag_id: number): Promise<number> {
        try {
            return await this.articleRepository
                        .createQueryBuilder("articles")
                        .leftJoinAndSelect("articles.category", "category")
                        .leftJoinAndSelect("articles.tags", "tag")
                        .where("tag.id = :tag_id", { tag_id: tag_id })
                        .cache(true)
                        .getCount();
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async getSearchResults(is_premium, search_query: string, page: number, page_size: number = 6) {
        try {
            let results = await this.articleRepository.query(`SELECT id, ts_rank(to_tsvector('english', title || ' ' || short_description || ' ' || content), to_tsquery('english', $1)) AS rank
            FROM articles
            WHERE (to_tsvector('english', title || ' ' || short_description || ' ' || content) @@ to_tsquery('english', $2)) LIMIT 20`, [search_query, search_query]);
            let ret = [];
            results = results.slice(page * page_size, (page + 1) * page_size);
            for (let result of results) {
                let article = await this.getArticleById(result.id);
                ret.push(article);
            }
            return ret;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async countSearchResults(is_premium, search_query: string) {
        try {
            return await this.articleRepository.query(`SELECT COUNT(*)
            FROM articles 
            WHERE (to_tsvector('english', title || ' ' || short_description || ' ' || content) @@ to_tsquery('english', $1))`, [search_query])
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
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
                cache: true,
            });
        } catch (error) {
            console.error(`Failed to retrieve article: ${error.message}`);
            return null;
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
                console.error(`Article with ID ${id} not found.`);
                return null;
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
            console.error(`Failed to update article: ${error.message}`);
            return null;
        }
    }

    async deleteArticle(id: number): Promise<void> {
        try {
            const article = await this.articleRepository.findOneBy({ id: id });
            if (!article) {
                console.error(`Article with ID ${id} not found.`);
                return null;
            }
            await this.articleRepository.remove(article);
        } catch (error) {
            console.error(`Failed to delete article: ${error.message}`);
            return null;
        }
    }

    async clearArticles(): Promise<void> {
        try {
            await this.articleRepository.delete({});
        } catch (error) {
            console.error(`Failed to clear articles: ${error.message}`);
            return null;
        }
    }
}