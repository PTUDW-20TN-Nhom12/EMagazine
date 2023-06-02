import express, {Router, Request, Response} from "express";
import {JWT} from "../utils/jwt-helper";
import { UserController } from "../controllers/user-controller";

const router: Router = Router();

router.use(express.json());

const REDIRECT_MAPPING = {
    "subscriber": "/",
    "writer": "/writer",
    "editor": "/editor",
    "admin": "/admin"
}

router.get("/", async (req: Request, res: Response) => {
    res.render("user_signin", {
        title: "Đăng nhập | Lacainews",
    })
})


router.post("/", async (req: Request, res: Response) => {
    const {email, password} = req.body; 

    res.status(200).json({ redirect: '/' });

})

export {router as signinRouter};