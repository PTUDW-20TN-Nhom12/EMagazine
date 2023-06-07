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

// init();
// let header = headerGenerator(true, false, false, -1);
// console.log(header.catList);

function getRandomTimestamp(startDate: Date, endDate: Date): string {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp = Math.floor(
      startTimestamp + Math.random() * (endTimestamp - startTimestamp)
    );
    const date = new Date(randomTimestamp);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  const startDate = new Date("2022-01-01");
  const endDate = new Date("2023-5-31");
  
  const timestamps: string[] = [];
  
  for (let i = 0; i < 50; i++) {
    const timestamp = getRandomTimestamp(startDate, endDate);
    timestamps.push(timestamp);
  }
  
  console.log(timestamps);