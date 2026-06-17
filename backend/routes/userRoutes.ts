import express from "express";
import userController from "../controllers/UserControll.js";

const userRoutes = express.Router();

userRoutes.post("/create/:companyId", userController.createEmployee);

export default userRoutes;