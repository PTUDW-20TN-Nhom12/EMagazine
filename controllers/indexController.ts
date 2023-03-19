import { Router, Request, Response } from "express";

const router: Router = Router();



const indexView = (req: Request, res: Response) => {
    res.render("index", {});
};

router.get("/", indexView);

export {
    router as indexRouter
};