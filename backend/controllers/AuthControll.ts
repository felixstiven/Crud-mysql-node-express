import { Request, Response, NextFunction } from "express";
import authService from "../services/AuthService.js";

class AuthController{
    //Registrar owner y company
    registerOwnerAndCompany = async (req:Request, res:Response, next:NextFunction) =>{

        try {
            const response = await authService.registerOwnerandCompany(req.body);
            return res.status(201).json(response);   
        } catch (error) {
            next(error);
        }
    }

    //Login de usuario
    login = async (req:Request, res:Response, next:NextFunction) => {

        //Caprurar datos
        const { email, password } = req.body;
        try {
            const response = await authService.Login({email, password});
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

const authController = new AuthController();
export default authController;