import  bcrypt from"bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ITokenPayload } from "../dt/interfaces.js";


const SECRET_KEY = process.env.JSON_SECRET_KEY || "";

//Normalizar email
export function normalizedEmail(email:string):string{
    return (email || "").trim().toLocaleLowerCase();
}

//funcion test email 
export function validarEmail(email: string):boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//Funcion test password
export function esPasswordValida(password: string):boolean {
  // Expresión regular para validar fortaleza de la contraseña
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/;
  return regex.test(password);
}


// hash password
export    function hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    // compare password
export    function comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    // generate jsonwebtoken
export    function generateToken(payload: ITokenPayload): string {
        return jwt.sign(payload, SECRET_KEY, {expiresIn: "8h"});
    }

    // verify jsonwebtoken
export    function verifyToken(token: string) { 
        return jwt.verify(token, SECRET_KEY);
    }


interface IRoleUser {
    role: "owner" | "tecnico" | "admin" | "supervisor";
}


export function verifyRoleIsOwner(role: IRoleUser): boolean {
    if (role.role == "owner") {
        return true;
    }
    return false;
}    


