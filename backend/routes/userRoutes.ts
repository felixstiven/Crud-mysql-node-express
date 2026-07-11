import express from "express";
import userController from "../controllers/UserControll.js";

const userRoutes = express.Router();

userRoutes.post("/create/:companyId", userController.createEmployee);
userRoutes.get("/load/:companyId", userController.getUsersByCompanyId);
userRoutes.delete("/delete/:id", userController.deleteEmployee);
userRoutes.put("/update/:id", userController.updateEmployee);

export default userRoutes;
