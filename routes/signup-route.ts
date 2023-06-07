import express, {Router, Request, Response} from "express";
import { UserController } from "../controllers/user-controller";
import { User } from "../models/user";
import { RoleController } from "../controllers/role-controller";

const router: Router = Router();

router.use(express.json());

router.get("/", async (req: Request, res: Response) => {
    const roleController = new RoleController(); 
    const roles = await roleController.getRoleEnableToSignup(); 

    res.render("user_signup", {
        title: "Đăng ký | Lacainews",
        roles: roles,
    })
})


router.post("/", async (req: Request, res: Response) => {
    const roleController = new RoleController();
    const {name, email, birthday, password, repassword, role} = req.body; 

    // create user from request 
    let user = new User(); 
    user.full_name = name; 
    if (role) 
        user.role = await roleController.getRoleIdByName(role); 
    else 
        user.role = null; 
    user.email = email; 
    user.birthday = birthday; 

    // call controller to sign up 
    const userController = new UserController(); 
    const result = await userController.signUp(user, password, repassword); 
    
    res.cookie("access_token", result.access_token, {"maxAge": 360000}).status(result.status).json(result.message);
})

export {router as signupRouter};