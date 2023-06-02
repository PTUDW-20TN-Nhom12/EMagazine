import {encode, decode} from "jwt-simple";

// Singleton
export class JWT {
    public KEY_LENGTH: number = 32;
    private SECRET_KEY: string;
    private static instance: JWT;

    private constructor() {
        this.SECRET_KEY = "";
        this.generateSecretKey();
    }
    public static getInstance(): JWT {
        if (!JWT.instance) {
            JWT.instance = new JWT();
        }
        return JWT.instance;
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

}
