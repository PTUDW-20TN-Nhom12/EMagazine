import { Router, Request, Response } from "express";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { UserRole } from "../models/role";
import { CategoryController } from "../controllers/category-controller";
import { RoleController } from "../controllers/role-controller";

const router: Router = Router();

const userMiddleware = new UserMiddleware();

router.get('/', async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    const categories = await categoryController.getAllMainCategories();
    res.json(categories);
});

router.get('/:id', async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    const category = await categoryController.getCategoryById(parseInt(req.params.id));
    res.json(category);
});

router.use(userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]));

router.post('/', async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    const roleController = new RoleController();
    let parent = null;
    if (req.body.parent)
        parent = parseInt(req.body.parent);
    const category = await categoryController.createCategory(req.body.name, req.body.description, parent);
    if (!req.body.parent)
        await roleController.createRole(UserRole.EDITOR, "Editor role with permissions to check and edit content.", category.id, false);
    res.json(category);
});

router.put('/:id', async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    let parent = null;
    if (req.body.parent)
        parent = parseInt(req.body.parent);
    const category = await categoryController.updateCategory(parseInt(req.params.id), req.body.name, req.body.description, parent);
    res.json(category);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const categoryController = new CategoryController();
    const roleController = new RoleController();
    const role = await roleController.getRoleByCategoryId(parseInt(req.params.id));
    if (role !== null)
        await roleController.deleteRole(role.id);
    await categoryController.deleteCategory(parseInt(req.params.id));
    res.sendStatus(200);
});

export {
    router as categoryApiRouter
};