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

interface ListResponse {
    title: string,
    date: string,
    note: string,
    short: string,
}

export class EditorController {
    private articleRepository = SupabaseDataSource.getRepository(Article);
    private statusRepository = SupabaseDataSource.getRepository(ArticleStatus);
    private categoryController = new CategoryController();
    private tagController = new TagController();

    private userController = new UserController();

    async getEditorList(editorCat: Category) {
        let catList: Article[];
        if (editorCat.children != null) {
            catList = await this.articleRepository.find({
                where: [
                    { category: editorCat },
                    { category: In(editorCat.children) },
                ],
                select: {
                    id: true,
                    title: true,
                    short_description: true,
                    thumbnail_url: true,
                }
            });
        } else {
            catList = await this.articleRepository.find({
                where: [
                    { category: editorCat },
                ],
                select: {
                    id: true,
                    title: true,
                    short_description: true,
                    thumbnail_url: true,
                }
            });
        }

        let result: Article[] = [];
        for (let i of catList) {
            let status = await this.getLatestStatusOfArticle(i.id);
            if (status.status === StatusList.DRAFT) {
                result.push(i);
            }
        }
        return result;
    }

    async getArticleDetails(articleId: number): Promise<Article> {
        return this.articleRepository.findOne({
            where: {
                id: articleId
            },
            relations: {
                category: true,
                tags: true,
            }
        })  
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
        status.status = StatusList.NEED_REVIEW;
        
        await this.statusRepository.save(status);
    }

    async getLatestStatusOfArticle(articleId: number): Promise<ArticleStatus> {
        const result = await this.statusRepository.findOne({
            where: {
                article: {id: articleId}
            },
            order: {
                time: "DESC"
            },
        });
        return result;
    }

    async publish(editorId: number, articleId: number, published_date: string): Promise<void> {
        const article = await this.articleRepository.findOne({
            where: { id: articleId },
        });
        const editor = await this.userController.getUserById(editorId);

        const status = new ArticleStatus();
        status.article = article;
        status.note = "publish";
        status.performer = editor;
        status.status = StatusList.PUBLISHED;
        await this.statusRepository.save(status);

        article.date_published = new Date(published_date);

        await this.articleRepository.save(article);
    }

    async getDeclineList(editorId: number): Promise<ListResponse[]> {
        const r = await this.statusRepository.find({
            where: {
                performer: {
                    id: editorId
                },
                status: StatusList.NEED_REVIEW
            },
            relations: {
                article: true
            }
        })
        return r.map(e => {
            return {
                title: e.article.title,
                date: e.time.toDateString(),
                note: e.note,
                short: e.article.short_description
            }
        })
    }
    async getAcceptList(editorId: number): Promise<ListResponse[]> {
        const r = await this.statusRepository.find({
            where: {
                performer: {
                    id: editorId
                },
                status: StatusList.PUBLISHED
            },
            relations: {
                article: true
            }
        })
        return r.map(e => {
            return {
                title: e.article.title,
                date: e.time.toDateString(),
                note: "",
                short: e.article.short_description
            }
        })
    }
}