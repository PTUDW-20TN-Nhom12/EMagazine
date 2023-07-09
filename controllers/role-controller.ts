import { SupabaseDataSource } from "../models/data_source";
import { Role, UserRole } from "../models/role";

export class RoleController {
    private roleRepository = SupabaseDataSource.getRepository(Role);

    async createRole(name: UserRole, description: string, category, is_enabled: boolean): Promise<Role> {
        const role = new Role();
        role.name = name;
        role.description = description;
        role.category = category;
        role.is_enabled = is_enabled;

        try {
            return await this.roleRepository.save(role);
        } catch (error) {
            console.error(`Failed to create role: ${error.message}`);
            return null; 
        }
    }

    async getAllRoles(): Promise<Role[]> {
        try {
            let result = await this.roleRepository.find();
            result = result.filter(item => (item.name !== UserRole.ADMIN && item.name !== UserRole.EDITOR));

            result = result.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.name === item.name
                ))
            );
            return result;
        } catch (error) {
            console.error(`Failed to retrieve roles: ${error.message}`);
            return null; 
        }
    }

    async getRoleById(id: number): Promise<Role> {
        try {
            return await this.roleRepository.findOneBy({ id: id });
        } catch (error) {
            console.error(`Failed to retrieve role: ${error.message}`);
            return null; 
        }
    }

    async updateRole(id: number, name: UserRole, description: string): Promise<Role> {
        try {
            const role = await this.roleRepository.findOneBy({ id: id });
            if (!role) {
                console.error(`Role with ID ${id} not found.`);
                return null; 
            }
            role.name = name;
            role.description = description;
            return await this.roleRepository.save(role);
        } catch (error) {
            console.error(`Failed to update role: ${error.message}`);
            return null; 
        }
    }

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

    async getRoleByName(name: string) {
        try {
            const role = await this.roleRepository.createQueryBuilder().where("name = :name", { name: name }).getOne();
            return role;
        } catch (error) {
            console.error(`Failed to get role by name ${name}: ${error.message}`);
            return null;
        }
    }

    async getRoleByCategory(name: string) {
        try {
            let result = await this.roleRepository.find({
                relations: {
                    category: true
                },
            });
            result = result.filter(item => (item.category !== null && item.category.name === name));
            return result[0];
        } catch (error) {
            console.error(`Failed to get role by category ${name}: ${error.message}`);
            return null;
        }
    }

    async getRoleByCategoryId(id: number) {
        try {
            let result = await this.roleRepository.find({
                relations: {
                    category: true
                },
            });
            result = result.filter(item => (item.category !== null && item.category.id === id));
            if (result.length === 0)
                return null;
            return result[0];
        } catch (error) {
            console.error(`Failed to get role by category ${id}: ${error.message}`);
            return null;
        }
    }

    async deleteRole(id: number): Promise<void> {
        try {
            const role = await this.roleRepository.findOneBy({ id: id });
            if (!role) {
                console.error(`Role with ID ${id} not found.`);
                return null; 
            }
            await this.roleRepository.remove(role);
        } catch (error) {
            console.error(`Failed to delete role: ${error.message}`);
            return null; 
        }
    }

    async clearRoles(): Promise<void> {
        try {
            await this.roleRepository.delete({});
        } catch (error) {
            console.error(`Failed to clear roles: ${error.message}`);
            return null; 
        }
    }
}