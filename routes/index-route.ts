import { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../utils/header-footer-generator";
import { ArticleController } from "../controllers/article-controller";
import { TagController } from "../controllers/tag-controller";
import { CommentController } from "../controllers/comment-controller";

import { UserMiddleware } from "../controllers/middleware/user-middleware";

const router: Router = Router();
const ART_PER_PAGE = 6;

const userMiddleware = new UserMiddleware(); 

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const articleControler = new ArticleController();

    res.render("index", {
        title: "Trang chủ | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.name),
        footer: await footerGenerator(),
        moi_nhat: await articleControler.getLatestArticles(),
        nhieu_nhat: await articleControler.getMostViewsArticles(),
        top_10: await articleControler.getMostViewByCategoryArticles(),
        noi_bat: await articleControler.getHotArticles(),
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
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.name),
        footer: await footerGenerator(),
        title: "Nội dung | Lacainews",

        id: article_id,
        comments: await commentController.getComment(article_id),

        category_name: article.category.name,
        imgLink: article.thumbnail_url.replace(/zoom\/260_163\//, ""),
        post_data: {
            post_title: article.title,
            date: article.date_created,
            tags: article.tags,
            content: article.content
        },
        items: relatedArticles,  
    })
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
        header: await headerGenerator(false, false, req.jwtObj.isPremium, category_id, req.jwtObj.name),
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
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.name),
        footer: await footerGenerator(),
    })
})

router.get("/search/:query/:page", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const query = req.params.query;
    const page = parseInt(req.params.page);
    const articleControler = new ArticleController(); 
    const searchQuery = query.replace(/ /g,"&");
    let totalArticles = await articleControler.countSearchResults(searchQuery);
    const articles = await articleControler.getSearchResults(searchQuery, page);
    totalArticles = Math.min(20,totalArticles[0]['count']);
    res.render("category_detail", {  
        title: 'Search: '+ query,
        page_name: 'Search: ' + query,
        items: articles,
        current_page: page,
        max_page: Math.ceil(totalArticles/ ART_PER_PAGE),
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.name), 
        footer: await footerGenerator(),
    })
})

export {
    router as indexRouter
};