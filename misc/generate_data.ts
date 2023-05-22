import tags from './data/tags.json';
import categories from './data/categories.json';
import articles from './data/articles.json';
import "reflect-metadata";
import { AppDataSource } from "../data_source";
import { TagController } from '../controllers/tag_controller';
import { CategoryController } from '../controllers/category_controller';
import { ArticleController } from '../controllers/article_controller';

async function initTags() {
    const tagController = new TagController();
    await tagController.clearTags();

    for (let tag of tags['tags']) {
        await tagController.createTag(tag['name'], tag['description']);
    }
}

async function initCategories() {
    const categoryController = new CategoryController();
    await categoryController.clearCategories();

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
    await articleController.clearArticles();

    for (let article of articles) {
        let n = article['Cate'].length;
        let category = await categoryController.getCategoryByName(article['Cate'][n-1])
        await articleController.createArticle(category, article['Titl'], article['Desc'], article['Cont'], article['Thum'], false);
    }

    for (let i = 1; i < 10; ++i) {
        let query = {page: i};
        let aaa = await articleController.getArticles(query);
        let bbb = [];
        for (let x of aaa[0]) {
            bbb.push(x.id);
        }
        console.log(bbb);
    }
}

async function init() {
    await AppDataSource.initialize()
    .then(async () => {
        console.log('Init connection completed');
        await initTags();
        await initCategories();
        await initArticles();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
};

init();