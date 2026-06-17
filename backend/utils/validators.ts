import  bcrypt from"bcrypt";

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

//Funcion hash password
export async function hashPassword(password:string):Promise<string>{
    return await bcrypt.hash(password, 10);
}

//funcion de comparacion password
export async function  comparePassword (password:string, hash:string):Promise<boolean>{
    return await bcrypt.compare(password, hash);
}
