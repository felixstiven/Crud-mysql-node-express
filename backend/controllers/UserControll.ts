import { Request, Response, NextFunction } from "express";
import userService from "../services/UserServices.js";

class UserController {
    //Crear empleado
    async createEmployee(req:Request, res:Response, nex:NextFunction){
        const companyId = Number(req.params.companyId);
        const userData = req.body;
        try {
            const result = await userService.createEmployee(userData, companyId);
            res.status(201).json(result);
        } catch (error) {
            nex(error);
        }
    }

    //Obtner todos los usuario de la empresa
    async getUsersByCompanyId(req: Request, res:Response, next:NextFunction){
        const companyId = Number(req.params.companyId);

        try {
            const response = await userService.getUsersByCompanyId(companyId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteEmployee(req:Request, res:Response, next:NextFunction){
        const id = Number(req.params.id);
        try {
            const response = await userService.deleteEmployee(id);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    //actuakizar usuario
    async updateEmployee(req:Request, res:Response, next:NextFunction){
        const id = Number(req.params.id);
        const data = req.body;
        try {
            const response = await userService.updateEmployee(id, data);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }

    }
}

const userController = new UserController();
export default userController;