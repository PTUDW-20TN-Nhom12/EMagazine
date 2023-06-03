import { Request, Response, NextFunction } from "express";
import { JWT } from "../../utils/user_controller/jwt-helper";

export class UserMiddleware { 
    authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.access_token;
        if (!token) {
            // @ts-ignore
            req.isAuth = false;
            return next();
        }
        try {
            const data = JWT.getInstance().verifyJWT(token);
            // @ts-ignore
            req.jwt_obj = data;
            // @ts-ignore
            req.isAuth = true;
            return next();
        } catch {
            // @ts-ignore
            req.isAuth = false;
            return next();
        }
    }
}