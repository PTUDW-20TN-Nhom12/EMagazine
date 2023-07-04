import { Router, Request, Response } from "express";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { UserRole } from "../models/role";

const router: Router = Router();

const userMiddleware = new UserMiddleware(); 

router.get("/", userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]), async (req: Request, res: Response) => {
    res.redirect('admin/dashboard')
})

router.get("/dashboard", userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]), async (req: Request, res: Response) => {
    res.render('admin/dashboard');
})

router.get("/categories", userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]), async (req: Request, res: Response) => {
    res.render('admin/categories');
})

router.get("/articles", userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]), async (req: Request, res: Response) => {
    res.render('admin/articles');
})

router.get("/tags", userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]), async (req: Request, res: Response) => {
    res.render('admin/tags');
})

router.get("/users", userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]), async (req: Request, res: Response) => {
    res.render('admin/users');
})

router.get("/editors", userMiddleware.authenticate, userMiddleware.checkRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    res.render('admin/editors');
})

export {
    router as adminRouter
};