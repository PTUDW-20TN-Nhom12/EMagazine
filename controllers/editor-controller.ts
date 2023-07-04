/*
List of Editor functionality
    - List article of category which have not been reviewed
    - Edit status of article (pass / need further change)
*/

import { In } from "typeorm";
import { Article } from "../models/article";
import { ArticleStatus, StatusList } from "../models/article-status";
import { Category } from "../models/category";
import { SupabaseDataSource } from "../models/data_source";
import { UserController } from "./user-controller";
import { CategoryController } from "./category-controller";
import { TagController } from "./tag-controller";

export class EditorController {

    private articleRepository = SupabaseDataSource.getRepository(Article);
    private statusRepository = SupabaseDataSource.getRepository(ArticleStatus);
    private categoryController = new CategoryController();
    private tagController = new TagController();

    private userController = new UserController();

    async getEditorList(editorCat: Category) {
        return await this.articleRepository.find({
            where: [
                { category: editorCat },
                { category: In(editorCat.children) },
            ]
        });
    }

    async updateCategoryTag(editorId: number, 
        articleId: number, categoryName: string, tagList: string[]) {
        
        const article = await this.articleRepository.findOneBy({id: articleId});

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

        article.category = category;
        article.tags = tags;
        await this.articleRepository.save(article);

        const status = new ArticleStatus();

        status.article = article;
        status.note = "OK"
        status.performer = await this.userController.getUserById(editorId);
        status.status = StatusList.ACCEPTED;

        // TODO: add publish date
        
        await this.statusRepository.save(status);

    }

    async createArticleStatus(editorId: number, articleId: number, review: string) {
        const status = new ArticleStatus();

        status.article = await this.articleRepository.findOneBy({id: articleId});
        status.note = review;
        status.performer = await this.userController.getUserById(editorId);
        status.status = StatusList.UNDER_REVIEW;
        
        await this.statusRepository.save(status);
    }

    async getLatestStatusOfArticle(articleId: number): Promise<ArticleStatus> {
        const result = await this.statusRepository.findOne({
            where: {
                article: {id: articleId}
            },
            relations: {
                performer: true
            },
            order: {
                time: "DESC"
            },
        });
        return result;
    }
}