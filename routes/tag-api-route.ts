import { Router, Request, Response } from "express";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { UserRole } from "../models/role";
import { TagController } from "../controllers/tag-controller";

const router: Router = Router();

const userMiddleware = new UserMiddleware(); 

router.get('/', async (req: Request, res: Response) => {
    const tagController = new TagController();
    const tags = await tagController.getAllTags();
    res.json(tags);
});

router.use(userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]));

router.post('/', async (req: Request, res: Response) => {
    const tagController = new TagController();
    const tag = await tagController.createTag(req.body.name, req.body.description);
    res.json(tag);
});

router.put('/:id', async (req: Request, res: Response) => {
    const tagController = new TagController();
    const tag = await tagController.updateTag(parseInt(req.params.id), req.body.name, req.body.description);
    res.json(tag);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const tagController = new TagController();
    await tagController.deleteTag(parseInt(req.params.id));
    res.sendStatus(200);
});

export {
    router as tagApiRouter
};