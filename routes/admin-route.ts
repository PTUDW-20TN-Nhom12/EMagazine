import { Router, Request, Response } from "express";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { UserRole } from "../models/role";
import { RoleController } from "../controllers/role-controller";
import { UserController } from "../controllers/user-controller";
import { CategoryController } from "../controllers/category-controller";
import { WriterController } from "../controllers/writer-controller";
import { ArticleController } from "../controllers/article-controller";

const router: Router = Router();

const userMiddleware = new UserMiddleware(); 

router.use(userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]));

router.get("/", async (req: Request, res: Response) => {
    res.redirect('admin/dashboard')
})

router.get("/dashboard", async (req: Request, res: Response) => {
    res.render('admin/dashboard');
})

router.get("/categories", async (req: Request, res: Response) => {
    res.render('admin/categories');
})

router.get("/category/:id", async (req: Request, res: Response) => {
    let id = parseInt(req.params.id);
    const categoryController = new CategoryController();
    const category = await categoryController.getCategoryById(id);
    res.render('admin/category', {category: category});
})

router.get("/articles", async (req: Request, res: Response) => {
    res.redirect('/admin/articles/1')
})

router.get("/articles/:page", async (req: Request, res: Response) => {
    let page = parseInt(req.params.page);
    res.render('admin/articles', {page: page});
})

router.get("/article/:id", async (req: Request, res: Response) => {
    const articleController = new ArticleController(); 
    const writerController = new WriterController(); 

    const articleId = parseInt(req.params.id); 
    const article = await articleController.getArticleById(articleId); 
    const articleStatus = await writerController.getLatestStatusOfArticle(articleId); 
    
    res.render("admin/edit_article", { 
        // @ts-ignore
        "fullname": req.jwtObj.full_name,
        "article": article, 
        "article_status": articleStatus
    });    
})

router.get("/add-article", async (req: Request, res: Response) => {
    res.render('admin/add_article');
})

router.get("/tags", async (req: Request, res: Response) => {
    res.render('admin/tags');
})

router.get("/users", async (req: Request, res: Response) => {
    res.render('admin/users');
})

router.get("/user/:id", async (req: Request, res: Response) => {
    let id = parseInt(req.params.id);
    const userController = new UserController();
    const user = await userController.getUserById(id);
    const roleController = new RoleController(); 
    const roles = await roleController.getAllRoles(); 
    res.render('admin/user', {user: user, roles: roles});
})

router.get("/add-user", async (req: Request, res: Response) => {
    const roleController = new RoleController(); 
    const roles = await roleController.getAllRoles(); 
    res.render('admin/add_user', {roles: roles});
})

router.get("/editors", async (req: Request, res: Response) => {
    res.render('admin/editors');
})

router.get("/add-editor", async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    const categories = await categoryController.getAllMainCategories();
    res.render('admin/add_editor', {categories: categories});
})

router.get("/editor/:id", async (req: Request, res: Response) => {
    let id = parseInt(req.params.id);
    const userController = new UserController();
    const categoryController = new CategoryController();
    const user = await userController.getUserById(id);
    const categories = await categoryController.getAllMainCategories();
    res.render('admin/editor', {user: user, categories: categories});
})

router.get("/profile", async (req: Request, res: Response) => {
    res.render('admin/profile');
})

router.get("/edit-profile", async (req: Request, res: Response) => {
    res.render('admin/edit_profile');
})

router.get("/change-password", async (req: Request, res: Response) => {
    res.render('admin/changepassword');
})

export {
    router as adminRouter
};