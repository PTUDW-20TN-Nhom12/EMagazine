import express, {Router, Request, Response} from "express";
import { CommentController } from "../controllers/comment-controller";
const router: Router = Router();

router.use(express.json());

router.post("/", async (req: Request, res: Response) => {
    const {name, content, article_id} = req.body;
    const c = new CommentController();
    await c.createGuestComment(article_id, name, content);
    res.status(200).json({});
});

export {router as CommentRouter};