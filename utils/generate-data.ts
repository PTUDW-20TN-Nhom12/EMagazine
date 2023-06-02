import tags from './data/tags.json';
import categories from './data/categories.json';
import articles from './data/articles.json';
import articlestags from './data/articlestags.json';
import viewslog from './data/viewslog.json';

import "reflect-metadata";
import { AppDataSource, SupabaseDataSource } from "../models/data_source";
import { TagController } from '../controllers/tag-controller';
import { CategoryController } from '../controllers/category-controller';
import { ArticleController } from '../controllers/article-controller';
import { ViewLogController } from '../controllers/viewslog-controller';

async function reset() {
    const articleController = new ArticleController();
    const categoryController = new CategoryController();
    const tagController = new TagController();
    await articleController.clearArticles();
    await categoryController.clearCategories();
    await tagController.clearTags();
}

async function initTags() {
    const tagController = new TagController();

    for (let tag of tags['tags']) {
        await tagController.createTag(tag['name'], tag['description']);
    }
}

async function initCategories() {
    const categoryController = new CategoryController();

    for (let category of categories['categories']) {
        await categoryController.createCategory(category['name'], category['description'], null);
    }
    for (let category of categories['categories']) {
        if (category['parent_id'] != null) {
            let parent = await categoryController.getCategoryByName(category['parent_id']);
            let child = await categoryController.getCategoryByName(category['name']);
            await categoryController.updateCategory(child.id, child.name, child.description, parent.id);
        }
    }
}

async function initArticles() {
    const articleController = new ArticleController();
    const categoryController = new CategoryController();

    for (let article of articles) {
        let n = article['Cate'].length;
        let category = await categoryController.getCategoryByName(article['Cate'][n-1])
        await articleController.createArticle(category, article['Titl'], article['Desc'], article['Cont'], article['Thum'], false);
    }
    for (let articletag of articlestags['ArticlesTags']) {
        articleController.addTag(articletag['articles_id'], articletag['tag_id']);
    }
}

async function initViewLog() {
    const viewLogController = new ViewLogController();
    for (let log of viewslog['ViewsLog']) {
        viewLogController.addViewLog(log['articles_id'], log['time']);
    }
}

async function init() {
    await SupabaseDataSource.initialize()
    .then(async () => {
        console.log('Init connection completed');
        // await reset();
        // await initTags();
        // await initCategories();
        // await initArticles();
        await initViewLog();
    }) 
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
};

init();