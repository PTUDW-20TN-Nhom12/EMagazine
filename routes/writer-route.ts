import express, { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../utils/header-footer-generator";
import { CategoryController } from "../controllers/category-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { Category } from "../models/category";
import { TagController } from "../controllers/tag-controller";
import { WriterController } from "../controllers/writer-controller";
import { write } from "fs";
import { ArticleController } from "../controllers/article-controller";

const router: Router = Router();

router.use(express.json());

const userMiddleware = new UserMiddleware();

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const writerController = new WriterController();

    // @ts-ignore 
    console.log(req.jwtObj)
 
    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") {
            // @ts-ignore
            const articles = await writerController.getListArticleOfAuthor(req.jwtObj.id); 
            const articlesStatus = await Promise.all(articles
                .map(async (item) =>
                    {
                        const currentStatus = await writerController.getLatestStatusOfArticle(item.id); 
                        const formattedDate = currentStatus.time.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                        return {"status": currentStatus.status, "time": formattedDate}
                    })); 
            
            // @ts-ignore
            res.render("writer_dashboard", { "fullname": req.jwtObj.full_name, "articles": articles, "articles_status": articlesStatus});
            return;
        }
    }

    // not writer
    res.render("not_available", {
        title: "Not Available | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    });
})

router.get("/new-article", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    const tagController = new TagController();

    // @ts-ignore
    console.log(req.jwtObj)

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") {
            const categories = (await categoryController.getAllCategories()).map(item => item.name);
            const tags = (await tagController.getAllTags()).map(item => item.name);

            // @ts-ignore
            res.render("writer_post", { "fullname": req.jwtObj.full_name, "categories": categories, "tags": tags });
            return;
        }
    }

    // not writer
    res.render("not_available", {
        title: "Not Available | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    });
})

router.get("/edit", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    const tagController = new TagController();

    // @ts-ignore
    console.log(req.jwtObj)

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") {
        }
    }

    // not writer
    res.render("not_available", {
        title: "Not Available | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    });
})

router.post("/upload", userMiddleware.authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (!req.isAuth) {
        res.status(401); 
        return; 
    }
    
    // @ts-ignore
    if (req.jwtObj.role.name != 'writer') { 
        res.status(401); 
        return; 
    }

    const { title, shortDescription, content, isPremium, category, tags } = req.body;
    const writerController = new WriterController(); 
    
    // @ts-ignore
    const result = await writerController.uploadArticle(req.jwtObj.id, title, 
            shortDescription, content, category, tags, isPremium); 

    console.log(result);

    // @ts-ignore
    res.status(result.status).json(result.message); 
})

router.get("/preview/:id", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const articleController = new ArticleController(); 
    const writerController = new WriterController(); 

    // @ts-ignore
    console.log(req.jwtObj)

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") { 
            const articleId = parseInt(req.params.id); 
            const article = await articleController.getArticleById(articleId); 
            const articlesStatus = await writerController.getLatestStatusOfArticle(articleId); 
            console.log(article.tags[0].name)
            res.render("writer_preview", { 
                // @ts-ignore
                "fullname": req.jwtObj.full_name,
                "article": article, 
                "article_status": articlesStatus});
            return;
        }
    }

    // not writer
    res.render("not_available", {
        title: "Not Available | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    });
})


export { router as writerRouter };
