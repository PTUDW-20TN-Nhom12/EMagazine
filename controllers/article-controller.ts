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
        author: User,
        category: Category,
        title: string,
        short_description: string,
        content: string,
        thumbnail_url: string,
        date_published: Date,
        is_premium: boolean
    ): Promise<Article> {
        const article = new Article();
        article.author = author;
        article.category = category;
        article.title = title;
        article.short_description = short_description;
        article.content = content;
        article.thumbnail_url = thumbnail_url;
        article.is_premium = is_premium;
        article.date_published = date_published;
        article.tags = [];

        try {
            return await this.articleRepository.save(article);
        } catch (error) {
            console.error(`Failed to create article: ${error.message}`);
            return null;
        }
    }

    async getArticleMetadataById(id: number): Promise<Article> {
        try {
            return await this.articleRepository.findOne({
                relations: {
                    category: true,
                    tags: true,
                },
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    title: true,
                    thumbnail_url: true,
                    is_premium: true,
                    short_description: true,
                    date_published: true,
                    category: {
                        id: true,
                        name: true,
                    },
                    tags: {
                        id: true,
                        name: true,
                    }
                },
                cache: true,
            });
        } catch (error) {
            console.error(`Failed to retrieve article: ${error.message}`);
            return null;
        }
    }                 

    async getHotArticles(is_premium, number = 4): Promise<Article[]> {
        try {
            let results = await this.articleRepository.query(`SELECT "articleId", COUNT(*) AS view_count
            FROM views_log
            WHERE time >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY "articleId"
            ORDER BY view_count DESC`); 
            let ret = [];
            for (let result of results) {
                let article = await this.getArticleMetadataById(result.articleId);
                if (is_premium === true || article.is_premium === false) {
                    ret.push(article);
                }
                if (ret.length === number) {
                    break;
                }
            }
            return ret;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async getLatestArticles(is_premium, number = 10): Promise<Article[]> {
        try {
            let results = await this.articleRepository.find({
                relations: {
                    category: true,
                },
                order: {
                    date_published: "DESC",
                },
                select: {
                    id: true,
                    title: true,
                    thumbnail_url: true,
                    is_premium: true,
                    category: {
                        id: true,
                        name: true,
                    },
                    tags: {
                        id: true,
                        name: true,
                    },
                },
            });
            let ret = [];
            for (let result of results) {
                if (is_premium === true || result.is_premium === false) {
                    ret.push(result);
                }
                if (ret.length === number) {
                    break;
                }
            }
            return ret;          
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
            ORDER BY view_count DESC`);
            let ret = [];
            for (let result of results) {
                let article = await this.getArticleMetadataById(result.articleId);
                if (is_premium === true || article.is_premium === false) {
                    ret.push(article);
                }
                if (ret.length === number) {
                    break;
                }
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
            ORDER BY views DESC`);  
            let ret = [];
            for (let result of results) {
                let article = await this.getArticleMetadataById(result.id);
                if (is_premium === true || article.is_premium === false) {
                    ret.push(article);
                }
                if (ret.length === number) {
                    break;
                }
            }
            return ret;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async addTag(article_id: number, tag: Tag) {
        try {
            let article = await this.getArticleById(article_id);
            article.tags.push(tag);
            await this.articleRepository.save(article);
        } catch (error) {
            console.error(`Failed to add tag: ${error.message}`);
            return null;
        }
    }

    async getArticlesByCategoryID(is_premium, category_id: number, page: number, page_size: number = 6): Promise<Article[]> {
        try {
            let results = await this.articleRepository.find({
                relations: {
                    category: true,
                    tags: true,
                },
                where: {
                    category: {
                        id: category_id,
                    },
                },
                order: {
                    is_premium: "DESC",
                    date_published: "DESC",
                },
                select: {
                    id: true,
                    title: true,
                    thumbnail_url: true,
                    is_premium: true,
                    category: {
                        id: true,
                        name: true,
                    },
                    tags: {
                        id: true,
                        name: true,
                    },
                },
                cache: true,
            });
            let skip = page * page_size;
            let ret = [];
            for (let result of results) {
                if (is_premium === true || result.is_premium === false) {
                    if (skip > 0) {
                        skip--;
                    }
                    else {
                        ret.push(result);
                    }
                }
                if (ret.length === page_size) {
                    break;
                }
            }
            return ret;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async countArticlesByCategoryID(is_premium, category_id: number): Promise<number> {
        try {
            let results = await this.articleRepository.find({
                relations: {
                    category: true,
                    tags: true,
                },
                where: {
                    category: {
                        id: category_id,
                    },
                },
                order: {
                    is_premium: "DESC",
                    date_published: "DESC",
                },
                select: {
                    id: true,
                    title: true,
                    thumbnail_url: true,
                    is_premium: true,
                    category: {
                        id: true,
                        name: true,
                    },
                    tags: {
                        id: true,
                        name: true,
                    },
                },
                cache: true,
            });
            let cnt = 0;
            for (let result of results) {
                if (is_premium === true || result.is_premium === false) {
                    cnt++;
                }
            }
            return cnt;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async getArticlesByTagID(is_premium, tag_id: number, page: number, page_size: number = 6): Promise<Article[]> {
        try {
            let results = await this.articleRepository.find({
                relations: {
                    category: true,
                    tags: true,
                },
                where: {
                    tags: {
                        id: tag_id,
                    },
                },
                order: {
                    is_premium: "DESC",
                    date_published: "DESC",
                },
                select: {
                    id: true,
                    title: true,
                    thumbnail_url: true,
                    is_premium: true,
                    category: {
                        id: true,
                        name: true,
                    },
                    tags: {
                        id: true,
                        name: true,
                    },
                },
                cache: true,
            });
            let skip = page * page_size;
            let ret = [];
            for (let result of results) {
                if (is_premium === true || result.is_premium === false) {
                    if (skip > 0) {
                        skip--;
                    }
                    else {
                        ret.push(result);
                    }
                }
                if (ret.length === page_size) {
                    break;
                }
            }
            return ret;  
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async countArticlesByTagID(is_premium, tag_id: number): Promise<number> {
        try {
            let results = await this.articleRepository.find({
                relations: {
                    category: true,
                    tags: true,
                },
                where: {
                    tags: {
                        id: tag_id,
                    },
                },
                order: {
                    is_premium: "DESC",
                    date_published: "DESC",
                },
                select: {
                    id: true,
                    title: true,
                    thumbnail_url: true,
                    is_premium: true,
                    category: {
                        id: true,
                        name: true,
                    },
                    tags: {
                        id: true,
                        name: true,
                    },
                },
                cache: true,
            });
            let cnt = 0;
            for (let result of results) {
                if (is_premium === true || result.is_premium === false) {
                    cnt++;
                }
            }
            return cnt;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async getSearchResults(is_premium, format:string, search_query: string, limit: number = 10) {
        try {
            let results = await this.articleRepository.query(`SELECT id, ts_rank(to_tsvector('english', ${format}), to_tsquery('english', $1)) AS rank
            FROM articles
            WHERE (to_tsvector('english', ${format}) @@ to_tsquery('english', $2)) 
            ORDER BY rank DESC`, [search_query, search_query]);
            let ret = [];
            for (let result of results) {
                let article = await this.getArticleMetadataById(result.id);
                if (is_premium === true || article.is_premium === false) {
                    ret.push(article);
                }
                if (ret.length === limit) {
                    break;
                }
            }
            return ret;
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
            return null;
        }
    }

    async countArticles(): Promise<number> {
        try {
            let result = await this.articleRepository.count();
            return result;
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
    async getAllArticles(page: number, page_size: number = 10): Promise<Article[]> {
        try {
            return await this.articleRepository.find({
                relations: {
                    author: true,
                    category: true,
                },
                order: {
                    id: 'DESC',
                },
                select: {
                    id: true,
                    title: true,
                    is_premium: true,
                    date_published: true,
                    author: {
                        email: true,
                    },
                    category: {
                        name: true,
                    }
                },
                skip: page * page_size,
                take: page_size,
            });
        } catch (error) {
            console.error(`Failed to retrieve articles: ${error.message}`);
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

    async updateArticleO(article: Article): Promise<Article> {
        try {
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