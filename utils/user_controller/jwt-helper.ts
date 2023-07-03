import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../../models/user';

// Singleton
export class JWTHelper {
  public KEY_LENGTH: number = 32;
  private SECRET_KEY: Secret;
  private static instance: JWTHelper;
  private static SECRET_KEY_SUPABASE = 'JUzolohVOJiP90FTd4btAwpshCq5wMip0xHGskLo0f7qmzSeDiRnaYamBnBZBCQWCi0P/vC0TNdzlGqmx2emBQ==';

  private constructor() {
    this.SECRET_KEY = '';
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
    if (this.SECRET_KEY !== '') return; // Already created
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // const charactersLength = characters.length;
    // for (let i = 0; i < this.KEY_LENGTH; i++) {
    //   this.SECRET_KEY += characters.charAt(
    //     Math.floor(Math.random() * charactersLength)
    //   );
    // }
    this.SECRET_KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }

  public signJWT(obj: object, expiresIn?: number): string {
    const payload = { ...obj }; // Make a copy of the object to ensure it's a plain object
    const tokenExpiresIn = expiresIn || 86400; // Token expires in 1 day (86400 seconds) by default, unless specified by the user
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: tokenExpiresIn, algorithm: 'HS512' });
  }

  public verifyJWT(accessToken: string): object {
    return jwt.verify(accessToken, this.SECRET_KEY, { algorithms: ['HS512'] });
  }

  public generateAccessTokenByUser(user: User) {
    return this.signJWT(user);
  }

  public encodeOAuthJWT(accessToken: string): object {
    return jwt.verify(accessToken, JWTHelper.SECRET_KEY_SUPABASE);
  }
}
