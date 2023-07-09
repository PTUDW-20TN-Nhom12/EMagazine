/*
List of Writer's functionality
    - Viewing own articles w/ status
    - Upload
    - Edit
*/

import { Article } from "../models/article";
import { ArticleStatus, StatusList } from "../models/article-status";
import {SupabaseDataSource} from "../models/data_source";
import { Tag } from "../models/tag";
import { User } from "../models/user";
import { CategoryController } from "./category-controller";
import { TagController } from "./tag-controller";
import { UserController } from "./user-controller";

export class WriterController {
    
    private tagController = new TagController();
    private categoryController = new CategoryController();
    private userController = new UserController();

    private articleRepository = SupabaseDataSource.getRepository(Article);
    private statusRepository = SupabaseDataSource.getRepository(ArticleStatus);

    async getListArticleOfAuthor(authorId: number, num_start_article: number) {
        return await this.articleRepository.find({
            where: {
                author: {id: authorId},
            },
            relations: {
                category: true,
                tags: true,
            }, 
            skip: num_start_article, 
            take: 6
        }) 
    }

    async getListArticleOfAuthorWithStatus(authorId: number, num_start_article: number, status: string[]) {
        return await this.articleRepository.query(
          `SELECT *
          FROM
              (SELECT * FROM articles WHERE "authorId" = $1) articles
          LEFT JOIN
              (SELECT latest_status."articleId",
                      latest_status.status, 
                      latest_status.time
              FROM articles_status latest_status
              INNER JOIN
                  (SELECT "articleId",
                          MAX(time) AS max_time
                  FROM articles_status
                  GROUP BY "articleId") latest_time 
              ON latest_status."articleId" = latest_time."articleId" 
                  AND latest_status.time = latest_time.max_time) latest_status 
          ON articles.id = latest_status."articleId"
          WHERE status IN ('${status.join("','")}')
          OFFSET $2
          LIMIT $3`,
          [authorId, num_start_article, 6]
        );
    }
      

    async getLatestStatusOfArticle(articleId: number): Promise<ArticleStatus> {
        return await this.statusRepository.findOne({
            where: {
                article: {id: articleId}
            },
            relations: { 
                performer: true
            },
            order: { 
                time:'DESC'
            }
        });
    }

    async getLatestStatusOfArticles(articleIds: number[]): Promise<ArticleStatus[]> {
        const promises = articleIds.map(async (id) => {
                return await this.statusRepository.findOne({
                    where: {
                        article: {id: id}
                    },
                    order: { 
                        time:'DESC'
                    }});
            });
    
        const results = await Promise.all(promises);
        return results;
    }

    // Based on Specification
    async uploadArticle(authorID: number, title: string, summary: string, content: string,
        thumbnail_url: string, categoryName: string, tagList: string[], premium = false): Promise<object> {

        try { 
            const newArticle = new Article();
            const newStatus = new ArticleStatus();

            const user = await this.userController.getUserById(authorID);
            let category = await this.categoryController.getCategoryByName(categoryName);
            // if category == null -> create new category
            if (category == null) {
                category = await this.categoryController.createCategory(categoryName, "", null);
            }

            const tags = await Promise.all(tagList.map(async tagName => {
                const t = await this.tagController.getTagByName(tagName);
                if (t == null) {
                    return await this.tagController.createTag(tagName, "");
                } else {
                    return t;
                }
            }));
 
            newArticle.author = user;
            newArticle.category = category;
            newArticle.content = content;
            newArticle.is_premium = premium;
            newArticle.short_description = summary;
            newArticle.title = title;
            newArticle.tags = tags;
            newArticle.thumbnail_url = thumbnail_url; 
            
            const saveArticleResult = await this.articleRepository.save(newArticle);

            newStatus.article = newArticle;
            newStatus.note = "Created"
            newStatus.performer = user;
            newStatus.status = StatusList.DRAFT;
            
            const saveArticleStatusResult = await this.statusRepository.save(newStatus);

            return {"status": 200, "message": "OK"}; 
        } catch (error) { 
            console.error(`Failed to upload article: ${error.message}`);
            return {"status": 403, "message": error.message}; 
        }
    }

    async editArticle(articleId: number, title: string, summary: string, content: string,
        thumbnail_url: string, categoryName: string, tagList: string[], premium = false) {
        
        try { 
            let article = await this.articleRepository
                .createQueryBuilder('article')
                .leftJoinAndSelect('article.author', 'author')
                .where('article.id = :id', { id: articleId })
                .getOne();
            let category = await this.categoryController.getCategoryByName(categoryName);
            // if category == null -> create new category
            if (category == null) {
                category = await this.categoryController.createCategory(categoryName, "", null);
            }

            const tags = await Promise.all(tagList.map(async tagName => {
                const t = await this.tagController.getTagByName(tagName);
                if (t == null) {
                    return await this.tagController.createTag(tagName, "");
                } else {
                    return t;
                }
            }));

            console.log(article); 

            // Modify article & status
            article.category = category;
            article.content = content;
            article.is_premium = premium;
            article.short_description = summary;
            article.title = title;
            article.tags = tags;
            article.thumbnail_url = thumbnail_url; 
            
            await this.articleRepository.save(article); 

            const newStatus = new ArticleStatus();

            newStatus.article = article;
            newStatus.note = "Created"
            newStatus.performer = article.author;
            newStatus.status = StatusList.DRAFT;

            await this.statusRepository.save(newStatus);

            return {"status": 200, "message": "OK"}; 
        } catch (error) { 
            console.error(`Failed to edit article: ${error.message}`);
            return {"status": 403, "message": error.message}; 
        }
    }
}