import tags from './data/tags.json';
import categories from './data/categories.json';
import articles from './data/articles.json';
import articlestags from './data/articlestags.json';
import viewslog from './data/viewslog.json';
import roles from './data/roles.json';

import "reflect-metadata";
import { AppDataSource, SupabaseDataSource } from "../models/data_source";
import { TagController } from '../controllers/tag-controller';
import { CategoryController } from '../controllers/category-controller';
import { ArticleController } from '../controllers/article-controller';
import { ViewLogController } from '../controllers/viewslog-controller';
import { RoleController } from '../controllers/role-controller';
import { UserController } from '../controllers/user-controller';
import { UserRole } from "../models/role";
import { StatusList } from '../models/article-status';
import { ArticleStatusController } from '../controllers/article-status-controller';
import moment from "moment";; 

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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
const startBirth = new Date("1999-01-01");
const endBirth = new Date("2002-5-31");
const startJoin = new Date("2021-01-01");
const endJoin = new Date("2021-5-31");

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
    const tagController = new TagController();
    const userController = new UserController();
    const user = await userController.getUserById(1);

    // for (let article of articles) {
    //     let n = article['Cate'].length;
    //     let category = await categoryController.getCategoryByName(article['Cate'][n - 1])
    //     let k = randomIntFromInterval(0, 2);
    //     let is_pre = false;
    //     if (k == 2) {
    //         is_pre = true;
    //     }
    //     await articleController.createArticle(user, category, article['Titl'], article['Desc'], article['Cont'], article['Thum'], is_pre);
    // }

    // for (let article of articles) {
    //     let n = article['Cate'].length;
    //     let category = await categoryController.getCategoryByName(article['Cate'][n - 1])
    //     let k = randomIntFromInterval(0, 2);
    //     let is_pre = false;
    //     if (k == 2) {
    //         is_pre = true;
    //     }
    //     const timestamp = getRandomTimestamp(startDate, endDate);
    //     await articleController.createArticle(category, article['Titl'], article['Desc'], article['Cont'], article['Thum'],timestamp, is_pre);
    // }
    for (let articletag of articlestags['ArticlesTags']) {
        let tag = await tagController.getTagById(articletag['tag_id']);
        articleController.addTag(articletag['articles_id'], tag);
    }
}

async function initRoles() {
    const roleController = new RoleController();
    for (let role of roles) {
        const key = Object.keys(UserRole).filter(x => UserRole[x] == role['name'])[0];
        await roleController.createRole(UserRole[key], role['description'], role['category'], role['is_enabled'])
    }
}

async function initViewLog() {
    const viewLogController = new ViewLogController();
    for (let log of viewslog['ViewsLog']) {
        viewLogController.addViewLog(log['articles_id'], log['time']);
    }
}

async function initArticleStatus() {
    const articleStatusController = new ArticleStatusController();
    const articleController = new ArticleController();
    const userController = new UserController();
    const user = await userController.getUserById(1);
    for (let i = 1; i <= 333; i++) {
        let article = await articleController.getArticleById(i);
        let day = moment(getRandomTimestamp(startDate, endDate)).toDate();
        let nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);
        await articleStatusController.createArticleStatus(article, user, StatusList.DRAFT, day, "Init article");
        await articleStatusController.createArticleStatus(article, user, StatusList.PUBLISHED, nextDay, "Published article");
    
    }

}

async function initUsers() {
    const userController = new UserController();
    const roleController = new RoleController();
    const adminRole = await roleController.getRoleById(1);


    await userController.genUser("Admin", "admin@lacainews.com", "admin", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);
   
    await userController.genUser("Writer", "writer@lacainews.com", "writer", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);

    await userController.genUser("Reader", "reader@lacainews.com", "reader", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);

    await userController.genUser("Premium", "premium@lacainews.com", "premium", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);

    await userController.genUser("Editor 1", "editor1@lacainews.com", "editor1", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);
    await userController.genUser("Editor 2", "editor2@lacainews.com", "editor2", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);
    await userController.genUser("Editor 3", "editor3@lacainews.com", "editor3", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);
    await userController.genUser("Editor 4", "editor4@lacainews.com", "editor4", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);
    await userController.genUser("Editor 5", "editor5@lacainews.com", "editor5", moment(getRandomTimestamp(startBirth, endBirth)).toDate(), moment(getRandomTimestamp(startJoin, endJoin)).toDate(), adminRole);
    
}

async function init() {
    SupabaseDataSource.initialize()
        .then(async () => {
            console.log('Init connection completed');
            // await reset();
            // await initTags();
            // await initCategories();
            // await initRoles();
            // await initArticles();
            // await initViewLog();
            // await initUsers();
            // await initArticleStatus();
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        });
};

init();