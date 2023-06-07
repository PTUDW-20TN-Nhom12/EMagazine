import { SupabaseDataSource } from "../models/data_source";
import { User } from "../models/user";
import { UserValidation } from "./validation/user-validation";
import { JWTHelper } from "../utils/user_controller/jwt-helper";
import { PasswordHelper } from "../utils/user_controller/password-helper";

export class UserController {
    private userRepository = SupabaseDataSource.getRepository(User);
    
    async signIn(email: any, password: any) {
        // let result = {"status": 200, "message": {}, "access_token": ""}; 
        
        // const user = await this.getUserByEmail(email); 
        
        // // check email
        // if (!user) { 
        //     result.message = {"error": "Email not exist"}; 
        //     result.status = 400; 
        //     return result; 
        // }

        // // check password match
        // const passwordHelper = new PasswordHelper(); 
        // const passwordMatch = await passwordHelper.comparePasswords(password, user.password);
        // if (!passwordMatch) { 
        //     result.message = {"error": "Password not match"}; 
        //     result.status = 400; 
        //     return result; 
        // }

        // // generate access token 
        // const jwtHelper = JWTHelper.getInstance();  
        // const accessToken = jwtHelper.generateAccessTokenByUser(user); 
        // result.access_token = accessToken; 

        // return result; 
    }

    async signUp(user: User, password: string, repassword: string) {
        console.log(user, password, repassword)

        let result = {"status": 200, "message": {}, "access_token": ""}; 

        // validate 
        const userValidation = new UserValidation(); 
        const validateResult = userValidation.validate(user, password, repassword); 
        if (!validateResult.valid) { 
            result.status = 400; 
            result.message = {"error": validateResult.message}; 
            console.log(result);
            return result; 
        }

        // check whether existed user 
        const emailExisted = await this.checkExistEmail(user.email); 
        if (emailExisted) { 
            result.status = 400; 
            result.message = {"error": "Email or linked account with this email is existed!"}; 
            return result; 
        }

        console.log(user);

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

    public async createUser(user: User) {
        try {
            const passwordHelper = new PasswordHelper(); 
            return await this.userRepository.save(user);
        } catch (error) {
            console.error(`Failed to create user: ${error.message}`);
            return null; 
        }
    }

    private async checkExistEmail(email: string) : Promise<boolean> { 
        try { 
            return await this.userRepository.createQueryBuilder().where("email = :email", {email: email}).getCount() > 0; 
        } catch (error) {
            console.error(`Failed to get email (check existed email): ${error.message}`);
            return null; 
        }
    }

    private async getUserByEmail(email: string) : Promise<User> { 
        try { 
            return await this.userRepository.createQueryBuilder().where("email = :email", {email: email}).getOne();
        } catch (error) { 
            console.error(`Failed to get user by email: ${error.message}`);
            return null; 
        }
    }
}
