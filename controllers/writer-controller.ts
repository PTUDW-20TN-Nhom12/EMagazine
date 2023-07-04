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

    async getListArticleOfAuthor(authorId: number) {
        return await this.articleRepository.find({
            where: {
                author: {id: authorId},
            },
            relations: {
                category: true,
                tags: true,
            }
        })
    }

    async getLatestStatusOfArticle(articleId: number): Promise<ArticleStatus> {
        const result = await this.statusRepository.find({
            where: {
                article: {id: articleId}
            },
            relations: {
                performer: true
            },
            order: {
                time: "DESC"
            },
            take: 1,
            cache: true,
        });
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    // Based on Specification
    async uploadArticle(authorID: number, title: string, summary: string, content: string,
        categoryName: string, tagList: string[], premium = false): Promise<void> {

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
        newArticle.thumbnail_url = "https://www.solidbackgrounds.com/images/1280x720/1280x720-black-solid-color-background.jpg"; // Hardcoded image
        
        await this.articleRepository.save(newArticle);

        newStatus.article = newArticle;
        newStatus.note = "Created"
        newStatus.performer = user;
        newStatus.status = StatusList.DRAFT;
        
        await this.statusRepository.save(newStatus);
    }

    async editArticle(articleId: number, title: string, summary: string, content: string,
        categoryName: string, tagList: string[], premium = false) {
        
        let article = await this.articleRepository.findOneBy({id: articleId});
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

        // Modify article & status
        article.category = category;
        article.content = content;
        article.is_premium = premium;
        article.short_description = summary;
        article.title = title;
        article.tags = tags;
        
        await this.articleRepository.save(article);

        const newStatus = new ArticleStatus();

        newStatus.article = article;
        newStatus.note = "Created"
        newStatus.performer = article.author;
        newStatus.status = StatusList.DRAFT;

        await this.statusRepository.save(newStatus);
    }
}