import tags from './data/tags.json';
import categories from './data/categories.json';
import articles from './data/articles.json';
import "reflect-metadata";
import { AppDataSource, SupabaseDataSource } from "../models/data_source";
import { CategoryController } from '../controllers/category-controller';
import { ArticleController } from '../controllers/article-controller';
import { footerGenerator, headerGenerator } from "./header-footer-generator";

async function query() {
    const articleController = new ArticleController();
    const a = await articleController.getHotArticles(false);
    console.log(a);
}

async function init() {
    await SupabaseDataSource.initialize()
    .then(async () => {
        console.log('Init connection completed');
        await query();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });
};

init()