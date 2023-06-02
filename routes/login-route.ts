// Dummy route for testing purpose
import express, {Router, Request, Response} from "express";
import {authenticate} from "./authenticate-middleware";
import {JWT} from "../utils/jwt-helper";
const router: Router = Router();

router.use(express.json());

const REDIRECT_MAPPING = {
    "subscriber": "/",
    "writer": "/writer",
    "editor": "/editor",
    "admin": "/admin"
}


router.get("/", authenticate, async (req: Request, res: Response) => {
    // @ts-ignore
    if (req.isAuth) {
        // @ts-ignore
        const redirectURL = REDIRECT_MAPPING[req.jwt_obj.additionalRole];
        res.redirect(redirectURL);
    } // Already logged in

    // Render login's here!.
    res.status(200).json({});
})


// Post request JSON {"username": ..., "password": ...}
router.post("/", async (req: Request, res: Response) => {
    const jreq = req.body; // json of ...

    // TODO: User controller.

    // Dummy
    res.cookie("access_token", JWT.getInstance().signJWT({
        fullname: "Nguyen Tan X",
        isPremium: true,
        additionalRole: "subscriber", // | "writer" | "editor" | "admin"
    }), {
        httpOnly: true,
        // secure: true
    }).redirect(REDIRECT_MAPPING["subscriber"]);
})

export {router as LoginRouter};