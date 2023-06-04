import { SupabaseDataSource } from "../models/data_source";
import { User } from "../models/user";
import { UserValidation } from "./validation/user-validation";
import { JWTHelper } from "../utils/user_controller/jwt-helper";
import { PasswordHelper } from "../utils/user_controller/password-helper";

export class UserController {
    private userRepository = SupabaseDataSource.getRepository(User);
    
    async signIn(email: any, password: any) {
        let result = {"status": 200, "message": {}, "access_token": ""}; 
        
        const user = await this.getUserByEmail(email); 
        
        // check email
        if (!user) { 
            result.message = {"error": "Email not exist"}; 
            result.status = 400; 
            return result; 
        }

        // check password match
        const passwordHelper = new PasswordHelper(); 
        console.log(password, user.password); 
        const passwordMatch = await passwordHelper.comparePasswords(password, user.password);
        if (!passwordMatch) { 
            result.message = {"error": "Password not match"}; 
            result.status = 400; 
            return result; 
        }

        // generate access token 
        const jwtHelper = JWTHelper.getInstance();  
        const accessToken = jwtHelper.generateAccessTokenByUser(user); 
        result.access_token = accessToken; 

        return result; 
    }

    async signUp(user: User, repassword: string) {
        let result = {"status": 200, "message": {}, "access_token": ""}; 

        // validate 
        const userValidation = new UserValidation(); 
        const validateResult = userValidation.validate(user, repassword); 
        if (!validateResult.valid) { 
            result.status = 400; 
            result.message = {"error": validateResult.message}; 
            return result; 
        }

        // check whether existed user 
        const emailExisted = await this.checkExistEmail(user.email); 
        if (emailExisted) { 
            result.status = 400; 
            result.message = {"error": "Email is existed!"}; 
            return result; 
        }

        // sign up 
        const createUserResult = await this.createUser(user); 
        if (!createUserResult) { 
            result.status = 400; 
            result.message = {"error": "Some error??"} 
            return result; 
        } 

        // generate access token 
        const jwtHelper = JWTHelper.getInstance();  
        const accessToken = jwtHelper.generateAccessTokenByUser(createUserResult); 
        result.access_token = accessToken; 

        return result; 
    }

    private async createUser(user: User) {
        try {
            const passwordHelper = new PasswordHelper(); 
            user.password = await passwordHelper.encryptPassword(user.password); 
            return await this.userRepository.save(user);
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    private async checkExistEmail(email: string) : Promise<boolean> { 
        try { 
            return await this.userRepository.createQueryBuilder().where("email = :email", {email: email}).getCount() > 0; 
        } catch (error) {
            throw new Error(`Failed to get email (check existed email): ${error.message}`);
        }
    }

    private async getUserByEmail(email: string) : Promise<User> { 
        try { 
            return await this.userRepository.createQueryBuilder().where("email = :email", {email: email}).getOne();
        } catch (error) { 
            throw new Error(`Failed to get user by email: ${error.message}`);
        }
    }
}
