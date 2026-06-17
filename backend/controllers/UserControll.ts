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
}

const userController = new UserController();
export default userController;