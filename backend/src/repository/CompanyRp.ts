import { Transaction } from "sequelize";
import { CompanyPg } from "../models/CompanyPg.js";
import { ICompany } from "../dt/interfaces.js";

class CompanyRepository {
    //Crear Compañia
    async createCompany(
        data: ICompany,
        transaction?: Transaction,
    ): Promise<CompanyPg> {
        return await CompanyPg.create(
            {
                name: data.companyName,
                trialExpiresAt: data.trialExpiresAt,
            },
            { transaction },
        );
    }

    //Obtener compañia por id
    async getCompanyById(id: number): Promise<CompanyPg | null> {
        return await CompanyPg.findByPk(id);
    }

    //Obtener compañia por nombre
    async getCompanyByName(companyName: string): Promise<CompanyPg | null> {
        return await CompanyPg.findOne({
            where: { name: companyName },
        });
    }

    //Actualizar Compañia
    async updateCompany(
        id: number,
        data: Partial<CompanyPg>,
    ): Promise<CompanyPg | null> {
        await CompanyPg.update(
            { data },
            {
                where: { id: id },
            },
        );
        return await this.getCompanyById(id);
    }
}

const companyRepository = new CompanyRepository();
export default companyRepository;
