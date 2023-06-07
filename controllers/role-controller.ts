import { SupabaseDataSource } from "../models/data_source";
import { Role } from "../models/role";

export class RoleController {
  private roleRepository = SupabaseDataSource.getRepository(Role);

  async getRoleEnableToSignup() {
    try {
      let results = await this.roleRepository.query('SELECT name FROM roles WHERE is_enabled = true;');
      results = results.map(item => item.name);
      return results; 
    } catch (error) {
      console.error(`Failed to get role to signup: ${error.message}`);
      return null; 
    }
  }

  async getRoleIdByName(name: string) { 
    try { 
      const role = await this.roleRepository.createQueryBuilder().where("name = :name", {name: name}).getOne(); 
      return role; 
    } catch (error) { 
      console.error(`Failed to get role by name ${name}: ${error.message}`);
      return null; 
    }
  }
}