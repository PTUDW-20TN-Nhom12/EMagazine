import { Router, Request, Response } from "express";
import { footerGenerator, headerGenerator } from "../utils/header-footer-generator";
import { CategoryController } from "../controllers/category-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { Category } from "../models/category";
import { TagController } from "../controllers/tag-controller";

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
            res.render("writer_post", {"fullname": req.jwtObj.full_name, "categories": categories, "tags": tags});
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

router.post("/upload", userMiddleware.authenticate, async (req: Request, res: Response) => {

})

export {router as writerRouter};
