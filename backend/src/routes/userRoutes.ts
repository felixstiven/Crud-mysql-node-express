import express from "express";
import userController from "../controllers/UserControll.js";
import { 
        authenticateToken,  
        soloAdminRole 
} from "../midelware/AuthMidelware.js";

const userRoutes = express.Router();

userRoutes.post(
    "/create/:companyId", 
    authenticateToken, 
    soloAdminRole, 
    userController.createEmployee
);

userRoutes.get(
    "/load/:companyId",
    authenticateToken,
    soloAdminRole,
    userController.getUsersByCompanyId
);

userRoutes.delete(
    "/delete/:id",
    authenticateToken,
    soloAdminRole, 
    userController.deleteEmployee
);

userRoutes.put(
    "/update/:id", 
    authenticateToken,
    soloAdminRole,
    userController.updateEmployee
);

export default userRoutes;