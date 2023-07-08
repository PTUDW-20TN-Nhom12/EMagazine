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
            throw new Error(`Failed to create role: ${error.message}`);
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
            throw new Error(`Failed to retrieve roles: ${error.message}`);
        }
    }

    async getRoleById(id: number): Promise<Role> {
        try {
            return await this.roleRepository.findOneBy({ id: id });
        } catch (error) {
            throw new Error(`Failed to retrieve role: ${error.message}`);
        }
    }

    async updateRole(id: number, name: UserRole, description: string): Promise<Role> {
        try {
            const role = await this.roleRepository.findOneBy({ id: id });
            if (!role) {
                throw new Error(`Role with ID ${id} not found.`);
            }
            role.name = name;
            role.description = description;
            return await this.roleRepository.save(role);
        } catch (error) {
            throw new Error(`Failed to update role: ${error.message}`);
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

    async deleteRole(id: number): Promise<void> {
        try {
            const role = await this.roleRepository.findOneBy({ id: id });
            if (!role) {
                throw new Error(`Role with ID ${id} not found.`);
            }
            await this.roleRepository.remove(role);
        } catch (error) {
            throw new Error(`Failed to delete role: ${error.message}`);
        }
    }

    async clearRoles(): Promise<void> {
        try {
            await this.roleRepository.delete({});
        } catch (error) {
            throw new Error(`Failed to clear roles: ${error.message}`);
        }
    }
}