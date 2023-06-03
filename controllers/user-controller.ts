import {SupabaseDataSource} from "../models/data_source";
import {User} from "../models/user";
import { UserValidation } from "./validation/user-validation";

export class UserController {
    private userRepository = SupabaseDataSource.getRepository(User);
    
    async signUp(user: User, repassword: string) {
        let result = {"status": 200, "message": {}}; 

        // validate 
        const userValidation = new UserValidation(); 
        const validateResult = userValidation.validate(user, repassword); 
        console.log('validate result: ', validateResult); 
        if (!validateResult.valid) { 
            result.status = 400; 
            result.message = {"error": validateResult.message}; 
            return result; 
        }


        // check whether existed user 
        const validateEmailResult = await this.checkExistEmail(user.email); 
        console.log('validate email: ', validateEmailResult); 
        if (validateEmailResult) { 
            result.status = 400; 
            result.message = {"error": "Email is existed!"}; 
            return result; 
        }


        // sign up 
        const createUserResult = await this.createUser(user); 
        console.log('create user result: ', createUserResult); 
        if (!createUserResult) { 
            result.status = 400; 
            result.message = {"error": "Some error??"} 
            return result; 
        } 

        return result; 
    }

    private async createUser(user: User) {
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new Error(`Failed to create article: ${error.message}`);
        }
    }

    private async checkExistEmail(email: string) : Promise<boolean> { 
        try { 
            return await this.userRepository.createQueryBuilder().where("email = :email", {email: email}).getCount() > 0; 
        } catch (error) {
            throw new Error(`Failed to retrieve articles: ${error.message}`);
        }
    }

}