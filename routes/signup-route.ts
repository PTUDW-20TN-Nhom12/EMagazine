import express, {Router, Request, Response} from "express";
import { UserController } from "../controllers/user-controller";

const router: Router = Router();

router.use(express.json());

router.get("/", async (req: Request, res: Response) => {
    res.render("user_signup", {
        title: "Đăng ký | Lacainews",
    })
})


router.post("/", async (req: Request, res: Response) => {
    const {name, email, birthday, password, repassword, role} = req.body; 

    console.log(name, email, birthday, password, repassword, role); 

    res.status(200).json({ redirect: '/' });

})

export {router as signupRouter};