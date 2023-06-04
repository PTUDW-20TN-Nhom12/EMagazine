import { Request, Response, NextFunction } from "express";
import { JWTHelper } from "../../utils/user_controller/jwt-helper";

export class UserMiddleware { 
    authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.access_token;
        
        console.log("token:", token); 
        if (!token) {
            // @ts-ignore
            req.isAuth = false;
            // @ts-ignore
            req.jwtObj = {"name": "", "isPremium": false};
            return next();
        }

        try {
            const jwtHelper = JWTHelper.getInstance(); 
            const data = jwtHelper.verifyJWT(token);
            // @ts-ignore
            req.jwtObj = data;
            // @ts-ignore
            req.isAuth = true;
            const currentTimestamp = new Date().getTime();
            // @ts-ignore
            const targetTimestamp = new Date(req.jwtObj.premium_expired).getTime();
            // @ts-ignore
            req.jwtObj.isPremium = targetTimestamp >= currentTimestamp;
            return next();
        } catch {
            // @ts-ignore
            req.isAuth = false;
            // @ts-ignore
            req.jwtObj = {"name": "", "isPremium": false};
            return next();
        }
    }
}