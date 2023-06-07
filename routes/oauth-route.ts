import express, {Router, Request, Response} from "express";
import { JWTHelper } from "../utils/user_controller/jwt-helper";
import { UserController } from "../controllers/user-controller";
import { RoleController } from "../controllers/role-controller";

const router: Router = Router();

router.use(express.json());

router.get("/",  async (req: Request, res: Response) => {
  res.render('oauth'); 
})

router.get("/signup",  async (req: Request, res: Response) => {
  try { 
    const user = JSON.parse(req.cookies.user); 
    const roleController = new RoleController(); 
    const userController = new UserController();

    if (userController.checkExistEmail(user.email)) { 
      const result = await userController.signIn(user.email); 
      res.cookie("access_token", result.access_token, {"maxAge": 360000}).redirect('/');
      return;
    }

    const roles = await roleController.getRoleEnableToSignup(); 

    res.render("user_signup", {
        title: "Đăng ký | Lacainews",
        roles: roles,
        type_sign_up: "Facebook", 
        user: user
    })
  } catch (error) { 
    console.error("Fail to render oauth signup ", error)
    res.status(400);
  }
})

router.post("/",  async (req: Request, res: Response) => {
  try { 
    const {access_token} = req.body; 
    const jwtHelper = JWTHelper.getInstance(); 

    const userInfo = jwtHelper.encodeOAuthJWT(access_token); 
    const user = { 
      // @ts-ignore
      'email': userInfo.email, 
      // @ts-ignore
      'name': userInfo.user_metadata.full_name
    }

    const userData = JSON.stringify(user);

    res.cookie("user", userData, {"maxAge": 360000}).status(200).json(userData);
  } catch (error) { 
    res.status(400);
  }
})

export {router as oauthRouter};
