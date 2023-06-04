import express, {Router, Request, Response} from "express";
import {JWTHelper} from "../utils/user_controller/jwt-helper";
import { UserController } from "../controllers/user-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";

const router: Router = Router();

router.use(express.json());

const REDIRECT_MAPPING = {
    "Reader": "/",
    "Subcriber": "/",
    "Writer": "/writer",
    "Editor": "/editor",
    "Admin": "/admin",
}

const userMiddleware = new UserMiddleware(); 

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    
    // @ts-ignore
    if (req.isAuth) { 
        // @ts-ignore
        const role = req.jwtObj.role; 
        res.redirect(REDIRECT_MAPPING[role])
    }
    
    res.render("user_signin", {
        title: "Đăng nhập | Lacainews",
    })
})


router.post("/", async (req: Request, res: Response) => {
    const {email, password} = req.body; 

    const userController = new UserController(); 
    const result = await userController.signIn(email, password); 

    console.log(result); 

    res.cookie("access_token", result.access_token, {"maxAge": 360000}).status(result.status).json(result.message);
})

export {router as signinRouter};