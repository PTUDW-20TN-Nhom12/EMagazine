import { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../utils/header-footer-generator";
import { ArticleController } from "../controllers/article-controller";
import { TagController } from "../controllers/tag-controller";
import { CommentController } from "../controllers/comment-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import puppeteer from 'puppeteer';

const router: Router = Router();
const ART_PER_PAGE = 6;
const REDIRECT_MAPPING = {
    "reader": "/",
    "subcriber": "/",
    "writer": "/writer",
    "editor": "/editor",
    "admin": "/admin",
}

const userMiddleware = new UserMiddleware(); 

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const articleControler = new ArticleController();

    // @ts-ignore
    console.log(req.jwtObj)

    // @ts-ignore
    if (req.isAuth) { 
        // @ts-ignore
        const role = req.jwtObj.role.name; 
        res.redirect(REDIRECT_MAPPING[role])
    } 
    
    // for guest 
    res.render("index", {
        title: "Trang chủ | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
        //@ts-ignore
        moi_nhat: await articleControler.getLatestArticles(req.jwtObj.isPremium),
        //@ts-ignore
        nhieu_nhat: await articleControler.getMostViewsArticles(req.jwtObj.isPremium),
        //@ts-ignore
        top_10: await articleControler.getMostViewByCategoryArticles(req.jwtObj.isPremium),
        //@ts-ignores
        noi_bat: await articleControler.getHotArticles(req.jwtObj.isPremium),
    })
})

router.get("/content/:id", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const article_id = parseInt(req.params.id);
    const articleControler = new ArticleController();
    const article = await articleControler.getArticleById(article_id);
    const relatedArticles = await articleControler.getArticlesByCategoryID(article.category.id, 0, 4);
    const commentController = new CommentController();

    res.render("post", {
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
        title: "Nội dung | Lacainews",

        id: article_id,
        comments: await commentController.getComment(article_id),

        category_name: article.category.name,
        imgLink: article.thumbnail_url.replace(/zoom\/260_163\//, ""),
        post_data: {
            post_title: article.title,
            date: new Date(),
            tags: article.tags,
            content: article.content
        },
        items: relatedArticles,  
        // @ts-ignore
        is_premium: req.jwtObj.isPremium,
    })
})

router.get("/api/raw-content/:id", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const article_id = parseInt(req.params.id);
    const articleControler = new ArticleController();
    const article = await articleControler.getArticleById(article_id);

    res.render("raw_post", {
        // @ts-ignore
        title: "Nội dung | Lacainews",
        id: article_id,
        category_name: article.category.name,
        post_data: {
            post_title: article.title,
            date: new Date(),
            tags: article.tags,
            content: article.content
        },
    })
})

router.get("/api/render-pdf/:id", userMiddleware.authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (!req.jwtObj.isPremium) {
        res.status(404).send("You do not have rights to visit this page");
    }

    const id = parseInt(req.params.id);
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(req.protocol + '://' + req.headers.host +  `/api/raw-content/${id}`, {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ format: 'A4' });
    
    await browser.close();
    res.setHeader("filename", `article-${id}.pdf`);
    res.send(pdf);
})

router.get("/category/:id/:page", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const category_id = parseInt(req.params.id);
    const page = parseInt(req.params.page);
    const articleControler = new ArticleController();
    const articles = await articleControler.getArticlesByCategoryID(category_id, page);
    const totalArticles = await articleControler.countArticlesByCategoryID(category_id);

    res.render("category_detail", {
        title: articles[0].category.name,
        page_name: articles[0].category.name,
        items: articles,
        current_page: page,
        max_page: Math.ceil(totalArticles/ ART_PER_PAGE),
        // @ts-ignore
        header: await headerGenerator(false, false, req.jwtObj.isPremium, category_id, req.jwtObj.full_name),
        footer: await footerGenerator(),
    })
})

router.get("/tag/:id/:page", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const tag_id = parseInt(req.params.id);
    const page = parseInt(req.params.page);
    const articleControler = new ArticleController(); 
    const tagController = new TagController();
    const tag = await tagController.getTagById(tag_id);
    const articles = await articleControler.getArticlesByTagID(tag_id, page);
    const totalArticles = await articleControler.countArticlesByTagID(tag_id);

    res.render("category_detail", {
        title: '#' + tag.name,
        page_name: '#' + tag.name, 
        items: articles,
        current_page: page,
        max_page: Math.ceil(totalArticles/ ART_PER_PAGE),
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    })
})

router.get("/search/:query/:page", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const query = req.params.query;
    const page = parseInt(req.params.page);
    const articleControler = new ArticleController(); 
    const searchQuery = query.replace(/ /g,"&");
    //@ts-ignore
    let totalArticles = await articleControler.countSearchResults(req.jwtObj.isPremium, searchQuery);
    //@ts-ignore
    const articles = await articleControler.getSearchResults(req.jwtObj.isPremium, searchQuery, page);
    totalArticles = Math.min(20,totalArticles[0]['count']);
    res.render("category_detail", {  
        title: 'Search: '+ query,
        page_name: 'Search: ' + query,
        items: articles,
        current_page: page,
        max_page: Math.ceil(totalArticles/ ART_PER_PAGE),
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name), 
        footer: await footerGenerator(),
    })
})

export {
    router as indexRouter
};