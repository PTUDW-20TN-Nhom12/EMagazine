import { Router, Request, Response} from "express";
import { ArticleController } from "../controllers/article-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { UserRole } from "../models/role";
import { WriterController } from "../controllers/writer-controller";
import { ArticleStatusController } from "../controllers/article-status-controller";
import { UserController } from "../controllers/user-controller";
import { StatusList } from "../models/article-status";
import moment from "moment";

const router: Router = Router();

const userMiddleware = new UserMiddleware();

router.use(userMiddleware.authenticate);

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
        const writerController = new WriterController();
        const articles = await articleController.getAllArticles(id);
        let statusList = []
        for (let i = 0; i < articles.length; i++) {
            const status = await writerController.getLatestStatusOfArticle(articles[i].id);
            statusList.push(status);
        }
        res.json({articles: articles, status: statusList});
    }
});

router.post('/search', async (req: Request, res: Response) => {
    const articleController = new ArticleController();
    const articles = await articleController.getSearchResults(req.body.is_premium, req.body.format, req.body.query);
    res.json(articles);
});

router.put('/:id', async (req: Request, res: Response) => {
    let id = parseInt(req.params.id);
    if (req.body.mode === 'type') {
        const articleController = new ArticleController();
        const article = await articleController.getArticleById(id);
        article.is_premium = (req.body.type == 'premium' ? true : false);
        const update = await articleController.updateArticleO(article);
        res.json(update);
    }
    else {
        const articleController = new ArticleController();
        const articlestatusController = new ArticleStatusController();
        const userController = new UserController();
        const article = await articleController.getArticleById(id);
        // @ts-ignore
        const user = await userController.getUserById(req.jwtObj.id);
        const key = Object.keys(StatusList).filter(x => StatusList[x] == req.body.status)[0];
        const status = await articlestatusController.createArticleStatus(article, user, StatusList[key], new Date(), req.body.message);
        if (req.body.published_date) {
            article.date_published = moment(req.body.published_date).toDate();
            await articleController.updateArticleO(article);
        }
        
        res.json(status);
    }
});


export {
    router as articleApiRouter
};