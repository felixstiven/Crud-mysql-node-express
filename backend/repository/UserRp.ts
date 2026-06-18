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
    //Obtener usuario por id
    async getUserById(id:number): Promise<UserPg | null>{
        return await UserPg.findOne(
            {
                where: {id:id},
                include:{
                    model: CompanyPg,
                    attributes: ["id", "name"]
                }
            }
        )
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
    async updateUser(id:number, data:Partial<UserPg>): Promise<UserPg|null>{
        await UserPg.update(
            data,
            {
                where: {id:id}
            }
        );
        return await this.getUserById(id);
    }

    //Eliminar ususario
    async deleteUser(id:number): Promise<void>{
        await UserPg.destroy(
            {
                where:{id:id}
            }
        );
    }
}

const userRepository = new UserRepository();
export default userRepository;