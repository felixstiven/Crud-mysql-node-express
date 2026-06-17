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

}

const userController = new UserController();
export default userController;