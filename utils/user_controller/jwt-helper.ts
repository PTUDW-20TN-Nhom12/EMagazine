import {encode, decode} from "jwt-simple";
import { User } from "../../models/user";

// Singleton
export class JWTHelper {
    public KEY_LENGTH: number = 32;
    private SECRET_KEY: string;
    private static instance: JWTHelper;

    private constructor() {
        this.SECRET_KEY = "";
        this.generateSecretKey();
    }

    public static getInstance(): JWTHelper {
        if (!JWTHelper.instance) {
            JWTHelper.instance = new JWTHelper();
        }
        return JWTHelper.instance;
    }

    // Vulnerable to Race Condition! -> Call first
    private generateSecretKey(): void {
        if (this.SECRET_KEY != "") return; // Already created
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < this.KEY_LENGTH; i++) {
            this.SECRET_KEY += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
    }

    public signJWT(obj: object): string {
        return encode(obj, this.SECRET_KEY, "HS512");
    }

    public verifyJWT(jwt: string): object {
        return decode(jwt, this.SECRET_KEY, false, "HS512");
    }

    public generateAccessTokenByUser(user: User) {
        const userInfo = {
            "email": user.email, 
            "role": user.role, 
            "name": user.full_name, 
            "premium_expired": user.premium_expired
        }

        return this.signJWT(userInfo); 
    }
}
