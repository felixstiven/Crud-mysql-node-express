import express from "express";
import { Request, Response, NextFunction } from "express";
import authController from "../controllers/AuthControll.js";

const routerAuth = express.Router();

//Ruta registro de usuario y empresa
routerAuth.post("/register", authController.registerOwnerAndCompany);

//Ruta login 
routerAuth.post("/login", authController.login);

export default routerAuth;
