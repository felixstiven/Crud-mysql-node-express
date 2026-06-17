import { UserPg } from "../models/UserPg.js";
import { CompanyPg } from "../models/CompanyPg.js";
import { Transaction } from "sequelize";

class UserRepository {
    //Craer usuarios
    async createUser(data:Partial<UserPg>, transaction?:Transaction): Promise<UserPg>{
        return await UserPg.create(
            data,
            {transaction}
        );
    }

    // obtener usuario por email
    async getUserByEmail(email:string): Promise<UserPg | null>{
        return await UserPg.findOne(
            {
                where:{email: email},
                include:{
                    model: CompanyPg,
                    attributes: ["id", "name"]
                }
            }
        );
    }
    //Obtener todos los usuarios de una empresa por id
    async getUsersByIdCompany(id_company:number): Promise<UserPg[]|null>{
        return await UserPg.findAll(
            {
                where: {companyId: id_company},
                include:{
                    model: CompanyPg,
                    attributes:["id", "name"]
                }
            }
        );
    }

    // Actualizar usuario 
    async updateUser(email:string, data:Partial<UserPg>): Promise<UserPg|null>{
        await UserPg.update(
            data,
            {
                where: {email:email}
            }
        );
        return await this.getUserByEmail(email);
    }

    //Eliminar ususario
    async deleteUser(email:string): Promise<void>{
        await UserPg.destroy(
            {
                where:{email:email}
            }
        );
    }
}

const userRepository = new UserRepository();
export default userRepository;