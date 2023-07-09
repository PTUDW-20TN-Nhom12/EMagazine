import { SupabaseDataSource } from "../models/data_source";
import { User } from "../models/user";
import { UserValidation } from "./validation/user-validation";
import { JWTHelper } from "../utils/user_controller/jwt-helper";
import { PasswordHelper } from "../utils/user_controller/password-helper";
import { Role } from "../models/role"; 
import { use } from "passport";
import { UserRole } from "../models/role";

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

    public async updateUser(user: User) { 
        return await this.userRepository.save(user);
    }

    private async getUserByEmail(email: string) : Promise<User> { 
        try { 
            return await this.userRepository.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('role.category', 'category')
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
            let result = await this.userRepository.findOne({
                where: { 
                    id: id 
                },
                relations: {
                    role: {
                        category: true,
                    }
                },
            });
            return result;
        } catch (error) {
            console.error(`Failed to retrieve category: ${error.message}`);
            return null;
        }
    }

    async getAllUsers(roles: Array<UserRole>): Promise<User[]> {
        try {
            let result = await this.userRepository.find({
                relations: {
                    role: {
                        category: true,
                    },
                },
            });

            if (roles.length > 0) {
                result = result.filter((user) => {
                    return roles.includes(user.role.name); 
                });
            }
            result.sort((a, b) => {
                return a.id - b.id;
            });
            
            return result; 
        } catch (error) {
            console.error(`Failed to retrieve categories: ${error.message}`);
            return null;
        }
    }

    async deleteUser(id: number): Promise<void> {
        try {
            const user = await this.userRepository.findOneBy({ id: id });
            if (!user) {
                console.error(`Tag with ID ${id} not found.`);
                return null; 
            }
            await this.userRepository.remove(user);
        } catch (error) {
            console.error(`Failed to delete category: ${error.message}`);
            return null; 
        }
    }
}
