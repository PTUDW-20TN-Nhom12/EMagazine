import { Router, Request, Response} from "express";
import { ArticleController } from "../controllers/article-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { UserRole } from "../models/role";

const router: Router = Router();

const userMiddleware = new UserMiddleware();

router.get('/:id', async (req: Request, res: Response) => {
    if (req.params.id === 'count') {
        const articleController = new ArticleController();
        const count = await articleController.countArticles();
        const numpage = Math.ceil(count/10);
        res.json({count, numpage});
    }
    else {
        let id = parseInt(req.params.id);
        const articleController = new ArticleController();
        const articles = await articleController.getAllArticles(id);
        res.json(articles);
    }
});

router.post('/search', async (req: Request, res: Response) => {
    const articleController = new ArticleController();
    const articles = await articleController.getSearchResults(req.body.is_premium, req.body.format, req.body.query);
    res.json(articles);
});

export {
    router as articleApiRouter
};