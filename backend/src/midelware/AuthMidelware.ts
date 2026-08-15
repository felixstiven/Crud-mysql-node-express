//midelware de autenticacion de usuario hash, password, jwt, role.
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserPg } from '../models/UserPg.js';
import jwt from 'jsonwebtoken';


interface CustomJwtPayload extends JwtPayload {
    id: number;
    role: string;
    companyId: number;
}


interface AuthenticatedRequest extends Request {
    user?: UserPg 
}

const secretKey: string = process.env.JSON_SECRET_KEY || '';

export const authenticateToken = async (req: AuthenticatedRequest, res:Response, next: NextFunction) => {

    try {
        const authHeader = req.header("Authorization");

        if(!authHeader) return res.status(401).json({message: "Token no proporcionado."});

        const part  = authHeader.split(" ");

        console.log("part", part);
        console.log("longitud part: ", part.length);
        if(part.length != 2 || part[0] != 'Bearer') return res.status(401).json({message: "Token invalido."});

        console.log("Hola");

        const token = part[1];
        console.log("token: ", token);
        const decodeToken = jwt.verify(token, secretKey) as CustomJwtPayload;

        console.log("decodeToken: ", decodeToken);
    
        const user = await UserPg.findByPk(decodeToken.id);
    
        if(!user) return res.status(401).json({message: "Usuario no encontrado"});

        req.user = user;

        next();
        
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) return res.status(401).json({message: "Token expirado o invalido."});
        if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ message: "Token invalido" });
        console.error("Error in AuthenticateToken: ", error);
        return res.status(500).json({ message: "Error de auntenticacion" });
    }
}

//Midelware par verificar que el rol sea owner
export const soloAdminRole = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(req?.user?.role != "owner") return res.status(403).json({message: "No tienes permisos para realizar esta accion."});

    next();
}

