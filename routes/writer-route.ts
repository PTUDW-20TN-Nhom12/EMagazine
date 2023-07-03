import { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../utils/header-footer-generator";
import { CategoryController } from "../controllers/category-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { Category } from "../models/category";

const router: Router = Router();

const userMiddleware = new UserMiddleware(); 

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const categoryController = new CategoryController();

    // @ts-ignore
    console.log(req.jwtObj)

    // @ts-ignore
    if (req.isAuth) { 
        // @ts-ignore
        const role = req.jwtObj.role.name; 
        if (role == "writer") { 
            // @ts-ignore
            res.render("writer_dashboard", {"fullname": req.jwtObj.full_name});
            return; 
        }
    } 
    
    // not writer
    res.render("not_available",  {
        title: "Not Available | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    }); 
})

router.get("/new-article", userMiddleware.authenticate, async (req: Request, res: Response) => {
    const categoryController = new CategoryController();

    // @ts-ignore
    console.log(req.jwtObj)

    // @ts-ignore
    if (req.isAuth) { 
        // @ts-ignore
        const role = req.jwtObj.role.name; 
        if (role == "writer") { 
            const categories = (await categoryController.getAllCategories()).map(item => item.name);
            console.log(categories);

            // @ts-ignore
            res.render("writer_post", {"fullname": req.jwtObj.full_name, "categories": categories});
            return; 
        }
    } 
    
    // not writer
    res.render("not_available",  {
        title: "Not Available | Lacainews",
        // @ts-ignore
        header: await headerGenerator(true, false, req.jwtObj.isPremium, -1, req.jwtObj.full_name),
        footer: await footerGenerator(),
    }); 
})

export {router as writerRouter};
