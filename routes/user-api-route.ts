import { Router, Request, Response } from "express";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { UserRole } from "../models/role";
import { UserController } from "../controllers/user-controller";
import { RoleController } from "../controllers/role-controller";
import { User } from "../models/user";
import moment from "moment";

const router: Router = Router();

const userMiddleware = new UserMiddleware();

router.use(userMiddleware.authenticate, userMiddleware.checkRole([UserRole.ADMIN]));

router.get('/', async (req: Request, res: Response) => {
    const userController = new UserController();
    const users = await userController.getAllUsers([UserRole.READER, UserRole.SUBSCRIBER, UserRole.WRITER]);
    res.json(users);
});

router.get('/editor', async (req: Request, res: Response) => {
    const userController = new UserController();
    const users = await userController.getAllUsers([UserRole.EDITOR]);
    res.json(users);
});

router.get('/current', async (req: Request, res: Response) => {
    const userController = new UserController();
    // @ts-ignore
    const user = await userController.getUserById(req.jwtObj.id);
    res.json(user);
});

router.put('/current', async (req: Request, res: Response) => {
    const userController = new UserController();
    // @ts-ignore
    const user = await userController.getUserById(req.jwtObj.id);
    user.full_name = req.body.full_name;
    user.birthday = moment(req.body.birthday, 'YYYY-MM-DD').toDate();
    const update = await userController.updateUser(user);
    res.json(update);
});

router.post('/', async (req: Request, res: Response) => {
    const userController = new UserController();
    const roleController = new RoleController();

    let data = new User();
    data.email = req.body.email;
    data.full_name = req.body.name;
    data.role = await roleController.getRoleByName(req.body.role);
    data.birthday = moment(req.body.dateOfBirth, 'YYYY-MM-DD').toDate();
    if (!req.body.role) {
        data.role = await roleController.getRoleByCategory(req.body.category);
    }
    else if (req.body.role === UserRole.SUBSCRIBER) {
        data.premium_expired = moment().add(1,'w').toDate();
    }
    const user = await userController.createUser(data);
    res.json(user);
});

router.put('/:id', async (req: Request, res: Response) => {
    const userController = new UserController();
    const roleController = new RoleController();
    const user = await userController.getUserById(parseInt(req.params.id));
    user.full_name = req.body.full_name;
    user.birthday = moment(req.body.birthday, 'YYYY-MM-DD').toDate();
    user.role = await roleController.getRoleByName(req.body.role);
    if (!req.body.role) {
        user.role = await roleController.getRoleByCategory(req.body.category);
    }
    else if (req.body.role === UserRole.SUBSCRIBER) {
        if (user.premium_expired === null) {
            user.premium_expired = moment().add(1,'w').toDate();
        }
        else {
            user.premium_expired = moment(req.body.premium_expired, 'YYYY-MM-DD').toDate();
        }
    }
    else {
        user.premium_expired = null;
    }
    const update = await userController.updateUser(user);
    res.json(update);
});

router.delete('/:id', async (req: Request, res: Response) => {
    const userController = new UserController();
    await userController.deleteUser(parseInt(req.params.id));
    res.sendStatus(200);
});

export {
    router as userApiRouter
};

