import { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../misc/header-footerGenerator";
import { ArticleController } from "../controllers/article_controller";
import { TagController } from "../controllers/tag_controller";

const router: Router = Router();
const ART_PER_PAGE = 6;

router.get("/", async (req: Request, res: Response) => {
    const articleControler = new ArticleController();

    res.render("index", {
        title: "Trang chủ | Lacainews",
        header: await headerGenerator(true, false, false, -1),
        footer: await footerGenerator(),
        moi_nhat: await articleControler.getLatestArticles(),
        nhieu_nhat: await articleControler.getMostViewsArticles(),
        top_10: await articleControler.getMostViewByCategoryArticles(),
        noi_bat: await articleControler.getHotArticles(),
    })
})

router.get("/content/:id", async (req: Request, res: Response) => {
    const article_id = parseInt(req.params.id);
    const articleControler = new ArticleController();
    const article = await articleControler.getArticleById(article_id);
    const relatedArticles = await articleControler.getArticlesByCategoryID(article.category.id, 0, 4);

    res.render("post", {
        header: await headerGenerator(true, false, false, -1),
        footer: await footerGenerator(),
        title: "Nội dung | Lacainews",

        category_name: article.category.name,
        imgLink: article.thumbnail_url,
        post_data: {
            post_title: article.title,
            date: article.date_created,
            tags: article.tags,
            content: article.content
        },
        items: relatedArticles,  
    })
})

router.get("/category/:id/:page", async (req: Request, res: Response) => {
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
        header: await headerGenerator(true, false, false, -1),
        footer: await footerGenerator(),
    })
})

router.get("/tag/:id/:page", async (req: Request, res: Response) => {
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
        header: await headerGenerator(true, false, false, -1),
        footer: await footerGenerator(),
    })
})

router.get("/search/:query/:page", async (req: Request, res: Response) => {
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
        header: await headerGenerator(true, false, false, -1), 
        footer: await footerGenerator(),
    })
})

export {
    router as indexRouter
};