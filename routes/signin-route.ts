import express, {Router, Request, Response} from "express";
import {JWTHelper} from "../utils/user_controller/jwt-helper";
import { UserController } from "../controllers/user-controller";
import { UserMiddleware } from "../controllers/middleware/user-middleware";
import { checkToken } from "../utils/captcha_helper";

const router: Router = Router();

router.use(express.json());

const userMiddleware = new UserMiddleware(); 

router.get("/", userMiddleware.authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.isAuth) { 
        // @ts-ignore
        const role = req.jwtObj.role; 
        res.redirect('/')
    }
    
    res.render("user_signin", {
        title: "Đăng nhập | Lacainews",
    })
})


router.post("/", async (req: Request, res: Response) => {
    const userEmail = req.body.email;
    const token = req.body.token;
    
    if (!await checkToken(token)) {
        return res.status(400).json({"error": "Invalid captcha"})
    }

    const userController = new UserController(); 
    const result = await userController.signIn(userEmail); 

    res.cookie("access_token", result.access_token, {"maxAge": 3600000}).status(result.status).json(result.message);
})

export {router as signinRouter};