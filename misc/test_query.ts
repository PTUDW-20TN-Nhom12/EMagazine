import tags from './data/tags.json';
import categories from './data/categories.json';
import articles from './data/articles.json';
import "reflect-metadata";
import { AppDataSource, SupabaseDataSource } from "../data_source";
import { CategoryController } from '../controllers/category_controller';
import { ArticleController } from '../controllers/article_controller';
import { footerGenerator, headerGenerator } from "../misc/header-footerGenerator";

async function query() {
    const articleController = new ArticleController();
    const a = await articleController.getArticlesByCategoryID(1, 0);
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

init();
// let header = headerGenerator(true, false, false, -1);
// console.log(header.catList);
