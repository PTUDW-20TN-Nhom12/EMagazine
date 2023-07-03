import { SupabaseDataSource } from "../models/data_source";
import { User } from "../models/user";
import { UserValidation } from "./validation/user-validation";
import { JWTHelper } from "../utils/user_controller/jwt-helper";
import { PasswordHelper } from "../utils/user_controller/password-helper";
import { Role } from "../models/role"; 
import { use } from "passport";

export class UserController {
    private userRepository = SupabaseDataSource.getRepository(User);
    
    async signIn(userEmail: string) {
        let result = {"status": 200, "message": {}, "access_token": ""}; 
        
        const user = await this.getUserByEmail(userEmail); 
        console.log(user); 
        
        // generate access token 
        const jwtHelper = JWTHelper.getInstance(); 
        const accessTokenUser = jwtHelper.generateAccessTokenByUser(user); 
        result.access_token = accessTokenUser; 

        return result; 
    }

    async signUp(user: User, password: string, repassword: string) {
        let result = {"status": 200, "message": {}, "access_token": ""}; 

        // validate 
        const userValidation = new UserValidation(); 
        const validateResult = userValidation.validate(user, password, repassword); 
        if (!validateResult.valid) { 
            result.status = 400; 
            result.message = {"error": validateResult.message}; 
            return result; 
        }

        // check whether existed user 
        const emailExisted = await this.checkExistEmail(user.email); 
        if (emailExisted) { 
            result.status = 400; 
            result.message = {"error": "Email or linked account with this email is existed!"}; 
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

    public async createUser(user: User) {
        try {
            const passwordHelper = new PasswordHelper(); 
            return await this.userRepository.save(user);
        } catch (error) {
            console.error(`Failed to create user: ${error.message}`);
            return null; 
        }
    }

    public async checkExistEmail(email: string) : Promise<boolean> { 
        try { 
            return await this.userRepository.createQueryBuilder().where("email = :email", {email: email}).getCount() > 0; 
        } catch (error) {
            console.error(`Failed to get email (check existed email): ${error.message}`);
            return null; 
        }
    }

    private async getUserByEmail(email: string) : Promise<User> { 
        try { 
            return await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.email = :email', { email })
            .getOne();
        } catch (error) { 
            console.error(`Failed to get user by email: ${error.message}`);
            return null; 
        }
    }
    
    async genUser(
        full_name: string,
        email: string,
        pseudonym: string,
        birthday: Date,
        date_created: Date,
        role: Role
    ): Promise<User> {
        let user = new User(); 
        user.full_name = full_name; 
        user.role = null; 
        user.email = email; 
        user.birthday = birthday;
        user.date_created = date_created;
        user.pseudonym = pseudonym;
        user.role = role;

        try {
            return await this.userRepository.save(user);
        } catch (error) {
            console.error(`Failed to create article: ${error.message}`);
            return null;
        }
    }

    async getUserById(id: number): Promise<User> {
        try {
            return await this.userRepository.findOneBy({ id: id });
        } catch (error) {
            console.error(`Failed to retrieve category: ${error.message}`);
            return null;
        }
    }
}
