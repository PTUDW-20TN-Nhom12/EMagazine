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


const ARTICLE_STATUS_ORDER = {
    "reject": 0,
    "draft": 1,
    "published": 2,
};

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    res.redirect('writer/dashboard');
})

router.get("/dashboard", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const writerController = new WriterController();

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        const role = req.jwtObj.role.name; 
        if (role == "writer") {
            // @ts-ignore
            let articles = await writerController.getListArticleOfAuthor(req.jwtObj.id, 0);   
            let articlesStatus = (await writerController.getLatestStatusOfArticles(articles.map(item => item.id)));

            // let sortedArticles = []; 
            // for (let i = 0; i < articles.length; ++i) { 
                //     sortedArticles.push({"article": articles[i], "article_status": articlesStatus[i]}); 
            // }
            // sortedArticles.sort((a, b) => ARTICLE_STATUS_ORDER[a.article_status.status] - ARTICLE_STATUS_ORDER[b.article_status.status])

            // articles = sortedArticles.map(item => item.article); 
            // articlesStatus = sortedArticles.map(item => item.article_status); 
            
            articles = articles.map((item, i) => {return {...item, "status": articlesStatus[i].status, "time": articlesStatus[i].time}})

            res.render("writer/dashboard", { 
                // @ts-ignore
                "fullname": req.jwtObj.full_name, 
                "articles": articles, 
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

router.post('/load-article', userMiddleware.authenticate, async (req: Request, res: Response) => { 
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

    const writerController = new WriterController(); 
    const { status, num_start_article } = req.body;
 
    // @ts-ignore
    const articles = await writerController.getListArticleOfAuthorWithStatus(req.jwtObj.id, num_start_article, status); 

    res.render('writer/articles', {articles})
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
            
            res.render("writer/post", { 
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

            res.render("writer/post", { 
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

    const articleStatus = await writerController.getLatestStatusOfArticle(id); 
    if (!articleStatus || articleStatus.status == 'published') { 
        return res.status(400).json({"error": "The article is published"}); 
    }
    
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
            const articleStatus = await writerController.getLatestStatusOfArticle(articleId); 
            
            res.render("writer/preview", { 
                // @ts-ignore
                "fullname": req.jwtObj.full_name,
                "article": article, 
                "article_status": articleStatus
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
            res.render("writer/profile", {
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
            res.render("writer/edit_profile", {
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
            res.render("writer/change_pass", {
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
