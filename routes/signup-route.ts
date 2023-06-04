import express, {Router, Request, Response} from "express";
import { UserController } from "../controllers/user-controller";
import { User } from "../models/user";

const router: Router = Router();

router.use(express.json());

router.get("/", async (req: Request, res: Response) => {
    res.render("user_signup", {
        title: "Đăng ký | Lacainews",
    })
})


router.post("/", async (req: Request, res: Response) => {
    const {name, email, birthday, password, repassword, role} = req.body; 

    // create user from request 
    let user = new User(); 
    user.full_name = name; 
    user.role = role; 
    user.email = email; 
    user.password = password; 
    user.birthday = birthday; 

    // call controller to sign up 
    const userController = new UserController(); 
    const result = await userController.signUp(user, repassword); 
    
    res.cookie("access_token", result.access_token, {"maxAge": 360000}).status(result.status).json(result.message);
})

export {router as signupRouter};