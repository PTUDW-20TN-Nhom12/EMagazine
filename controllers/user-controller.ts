import {SupabaseDataSource} from "../models/data_source";
import {User} from "../models/user";

export class UserController {
    private userRepository = SupabaseDataSource.getRepository(User);

    
}