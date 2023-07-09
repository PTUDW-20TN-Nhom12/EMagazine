import { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../utils/header-footer-generator";
import { ArticleController } from "../controllers/article-controller";
import { TagController } from "../controllers/tag-controller";
import { CommentController } from "../controllers/comment-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { ViewLogController } from "../controllers/viewslog-controller";
import puppeteer from 'puppeteer';
import { UserController } from "../controllers/user-controller";

const router: Router = Router();
const ART_PER_PAGE = 6;
const REDIRECT_MAPPING = {
    "reader": "/",
    "subscriber": "/",
    "writer": "/writer",
    "editor": "/editor",
    "admin": "/admin",
}

const userMiddleware = new UserMiddleware(); 

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const articleControler = new ArticleController();

    // [DEBUG]
    // console.log(req.jwtObj)

    // @ts-ignore
    if (req.isAuth) { 
        // @ts-ignore
        const role = req.jwtObj.role.name; 
        if (REDIRECT_MAPPING[role] != '/') 
            res.redirect(REDIRECT_MAPPING[role])
    } 
    // @ts-ignore
    let isPremium = req.jwtObj.isPremium;
    res.render("index", {
        title: "Trang chủ | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
        moi_nhat: await articleControler.getLatestArticles(isPremium),
        nhieu_nhat: await articleControler.getMostViewsArticles(isPremium),
        top_10: await articleControler.getMostViewByCategoryArticles(isPremium),
        noi_bat: await articleControler.getHotArticles(isPremium),
    })
})

router.get("/content/:id", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const article_id = parseInt(req.params.id);
    const articleControler = new ArticleController();
    const article = await articleControler.getArticleById(article_id);
    // @ts-ignore
    const relatedArticles = await articleControler.getArticlesByCategoryID(req.jwtObj.isPremium, article.category.id, 0, 4);
    const commentController = new CommentController();
    const viewlogController = new ViewLogController();
    await viewlogController.createViewLog(article);
    
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
            date: article.date_published,
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
            date: article.date_published,
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
    // @ts-ignore
    const isPremium = req.jwtObj.isPremium;
    const articles = await articleControler.getArticlesByCategoryID(isPremium, category_id, page);
    const totalArticles = await articleControler.countArticlesByCategoryID(isPremium, category_id);

    res.render("category_detail", {
        search_page: false,
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
    // @ts-ignore
    const isPremium = req.jwtObj.isPremium;
    const articles = await articleControler.getArticlesByTagID(isPremium, tag_id, page);
    const totalArticles = await articleControler.countArticlesByTagID(isPremium, tag_id);

    res.render("category_detail", {
        search_page: false,
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

router.get("/search/:query", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const query = req.params.query;
    res.render("search_detail", {  
        // @ts-ignore
        is_pre: req.jwtObj.isPremium,
        search_page: true,
        title: 'Search: '+ query,
        page_name: 'Search: ' + query,
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name), 
        footer: await footerGenerator(),
    })
})

router.get("/profile", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const profile_form = [
        {
          "attribute_name": "Lacainews ID:",
          "id": "LacainewsID",
          "placeholder": "",
          "type": "text"
        },
        {
          "attribute_name": "Họ tên: ",
          "id": "name",
          "placeholder": "",
          "type": "text"
        },
        {
          "attribute_name": "Email liên lạc:",
          "id": "email",
          "placeholder": "",
          "type": "email"
        },
        {
          "attribute_name": "Ngày tháng năm sinh:",
          "id": "dateOfBirth",
          "placeholder": "",
          "type": "text"
        },
        {
          "attribute_name": "Thời hạn premium",
          "id": "premiumDate",
          "placeholder": "",
          "type": "text"
        }
    ]

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        console.log(req.jwtObj);

        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "reader" || role == "subscriber") { 
            // @ts-ignore
            profile_form[0].placeholder = req.jwtObj.id; 
            // @ts-ignore
            profile_form[1].placeholder = req.jwtObj.full_name; 
            // @ts-ignore
            profile_form[2].placeholder = req.jwtObj.email; 
            // @ts-ignore
            profile_form[3].placeholder = new Date(req.jwtObj.birthday).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); 
            // @ts-ignore
            profile_form[4].placeholder = req.jwtObj.expire_date;  

            res.render("profile", {  
                title: "Thông tin cá nhân | Lacainews",
                profile_form: profile_form,
                // @ts-ignore
                header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name), 
                footer: await footerGenerator(),
            })
            return;
        }
    }

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
    if (req.jwtObj.role.name != 'subscriber' && req.jwtObj.role.name != 'reader') { 
        res.status(401); 
        return; 
    }

    const userController = new UserController(); 
    // @ts-ignore
    const user = await userController.getUserById(req.jwtObj.id); 
    const { fullname, birthday } = req.body;

    user.full_name = fullname; 
    user.birthday = new Date(birthday); 

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


router.get("/update-profile", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const profile_form = [
        {
          "attribute_name": "Họ tên: ",
          "id": "name",
          "placeholder": "",
          "type": "text"
        },
        {
          "attribute_name": "Email liên lạc:",
          "id": "email",
          "placeholder": "",
          "type": "email"
        },
        {
          "attribute_name": "Ngày tháng năm sinh:",
          "id": "birthday",
          "placeholder": "",
          "type": "date"
        }
    ]

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        console.log(req.jwtObj);

        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "reader" || role == "subscriber") { 
            // @ts-ignore
            profile_form[0].placeholder = req.jwtObj.full_name; 
            // @ts-ignore
            profile_form[1].placeholder = req.jwtObj.email;  
            // @ts-ignore
            profile_form[2].placeholder = new Date(req.jwtObj.birthday).toISOString().substr(0, 10); 

            res.render("update_profile", {  
                title: "Thay đổi thông tin | Lacainews",
                profile_form: profile_form,
                // @ts-ignore
                header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name), 
                footer: await footerGenerator(),
            })
            return;
        }
    }

    res.render("not_available", {
        title: "Not Available | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    });
})


router.get("/update-password", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const profile_form = [
      {
        "attribute_name": "New password: ",
        "id": "new-password",
        "type": "password"
      },
      {
        "attribute_name": "Retype password:",
        "id": "retype-password",
        "type": "password"
      }
    ]

    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        console.log(req.jwtObj);

        // @ts-ignore
        const role = req.jwtObj.role.name;
        if (role == "reader" || role == "subscriber") { 
            res.render("change_password", {  
                title: "Thay đổi mật khẩu | Lacainews",
                profile_form: profile_form,
                // @ts-ignore
                header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name), 
                footer: await footerGenerator(),
            })
            return;
        }
    }

    res.render("not_available", {
        title: "Not Available | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    });
})

export {
    router as indexRouter
};