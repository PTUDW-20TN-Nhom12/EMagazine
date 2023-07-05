import express, { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../utils/header-footer-generator";
import { CategoryController } from "../controllers/category-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { Category } from "../models/category";
import { TagController } from "../controllers/tag-controller";
import { WriterController } from "../controllers/writer-controller";
import { write } from "fs";
import { ArticleController } from "../controllers/article-controller";
import { User } from "../models/user";
import { UserController } from "../controllers/user-controller";

const router: Router = Router();

router.use(express.json());

const userMiddleware = new UserMiddleware();

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const writerController = new WriterController();

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
            
            res.render("writer_dashboard", { 
                // @ts-ignore
                "fullname": req.jwtObj.full_name, 
                "articles": articles, 
                "articles_status": articlesStatus
            });

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
    if (req.isAuth) {
        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") {
            const categories = (await categoryController.getAllCategories()).map(item => item.name);
            const tags = (await tagController.getAllTags()).map(item => item.name);
            
            res.render("writer_post", { 
                // @ts-ignore
                "fullname": req.jwtObj.full_name, 
                "categories": categories, 
                "tags": tags, 
                "article": undefined 
            });
            
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

router.get("/edit/:id", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    const tagController = new TagController();
    const articleController = new ArticleController(); 
    const writerController = new WriterController(); 

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") { 
            const articleId = parseInt(req.params.id); 
            const article = await articleController.getArticleById(articleId); 
            const categories = (await categoryController.getAllCategories()).map(item => item.name);
            const tags = (await tagController.getAllTags()).map(item => item.name);

            console.log(article);

            res.render("writer_post", { 
                // @ts-ignore
                "fullname": req.jwtObj.full_name, 
                "categories": categories, 
                "tags": tags, 
                "article": article 
            });

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



router.post("/edit", userMiddleware.authenticate, async (req: Request, res: Response) => {
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

    const { id, title, shortDescription, content, isPremium, category, tags } = req.body;
    const writerController = new WriterController(); 
    
    const result = await writerController.editArticle(id, title, 
            shortDescription, content, category, tags, isPremium); 

    console.log(result);

    // @ts-ignore
    res.status(result.status).json(result.message); 
})

router.get("/preview/:id", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const articleController = new ArticleController(); 
    const writerController = new WriterController(); 

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") { 
            const articleId = parseInt(req.params.id); 
            const article = await articleController.getArticleById(articleId); 
            const articlesStatus = await writerController.getLatestStatusOfArticle(articleId); 
            
            res.render("writer_preview", { 
                // @ts-ignore
                "fullname": req.jwtObj.full_name,
                "article": article, 
                "article_status": articlesStatus
            });

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

router.get("/profile", userMiddleware.authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        console.log(req.jwtObj);

        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") { 
            res.render("writer_profile", {
                // @ts-ignore
                "fullname": req.jwtObj.full_name,
                // @ts-ignore
                "user": req.jwtObj
            });
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

router.get("/edit-profile", userMiddleware.authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        console.log(req.jwtObj);

        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") { 
            res.render("writer_edit_profile", {
                // @ts-ignore
                "fullname": req.jwtObj.full_name,
                // @ts-ignore
                "user": req.jwtObj
            });
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

router.post("/edit-profile", userMiddleware.authenticate, async (req: Request, res: Response) => {
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

    const userController = new UserController(); 
    // @ts-ignore
    const user = await userController.getUserById(req.jwtObj.id); 
    const { fullname, birthday, pseudonym } = req.body;

    user.full_name = fullname; 
    user.birthday = new Date(birthday); 
    user.pseudonym = pseudonym;

    // @ts-ignore
    console.log(user); 
    
    try { 
        userController.updateUser(user);  

        // @ts-ignore
        res.status(200).json('OK'); 
    } catch (error) {
        console.error(`Failed to update user: ${error.message}`);
        res.status(403).json(error.message); 
    }
})

router.get("/change-password", userMiddleware.authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        console.log(req.jwtObj);

        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "writer") { 
            res.render("writer_changepassword", {
                // @ts-ignore
                "fullname": req.jwtObj.full_name,
                // @ts-ignore
                "user": req.jwtObj
            });
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
