import { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../utils/header-footer-generator";
import { ArticleController } from "../controllers/article-controller";
import { TagController } from "../controllers/tag-controller";
import { CommentController } from "../controllers/comment-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { UserRole } from "../models/role";

const router: Router = Router();

const userMiddleware = new UserMiddleware(); 

router.get("/", userMiddleware.authenticate, userMiddleware.checkRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    res.redirect('admin/dashboard')
})

router.get("/dashboard", userMiddleware.authenticate, async (req: Request, res: Response) => {
    res.render('admin/dashboard');
})

router.get("/categories", userMiddleware.authenticate, async (req: Request, res: Response) => {
    res.render('admin/categories');
})

router.get("/articles", userMiddleware.authenticate, async (req: Request, res: Response) => {
    res.render('admin/articles');
})

router.get("/tags", userMiddleware.authenticate, async (req: Request, res: Response) => {
    res.render('admin/tags');
})

router.get("/users", userMiddleware.authenticate, async (req: Request, res: Response) => {
    res.render('admin/users');
})

router.get("/editors", userMiddleware.authenticate, async (req: Request, res: Response) => {
    res.render('admin/editors');
})

export {
    router as adminRouter
};