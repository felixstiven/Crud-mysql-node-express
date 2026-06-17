
import { UserPg } from "../models/UserPg.js";
import companyRepository from "../repository/CompanyRp.js";
import userRepository from "../repository/UserRp.js";
import { IUser } from "../dt/interfaces.js";
import { 
    validarEmail,  
    normalizedEmail,
    esPasswordValida,
    hashPassword
} from "../utils/validators.js";



class UserService{

    //Crear usuario empleados (jefes, tecnicos) de una empresa ya registrada
    async createEmployee(data:IUser, companyId:number){
        const {
            firstName,
            secondName,
            firstLastName,
            secondLastName,
            email,
            password,
            role,
        } = data; 

        // Definir Rol 
        if(role !== "supervisor" && role !== "tecnico" && role !== "admin") throw new Error("Rol no valido.");

        //Validar que venga un companyId
        if(!companyId) throw new Error("companyId es requerido.");
        
        //Validar campos obligatorios
        if(!firstName || !firstLastName || !email || !password) throw new Error("Datos obligatorios no proporcionados.");

        //Normalizar y validar email
        const emailNorm = normalizedEmail(email);
        if(!validarEmail(emailNorm)) throw new Error("Email no valido.");

        //Validar contreña
        const PasswordValida = esPasswordValida(password);
        if(!PasswordValida) throw new Error("Contraseña no valida. Debe contener al menos 8 caracteres, 1 numero, 1 mayuscula, 1 minuscula y 1 caracter especial.");

        //Verificar si existe el email y si la empresa existe
        const existeUser = await userRepository.getUserByEmail(emailNorm);
        const existeCompany = await companyRepository.getCompanyById(companyId);

        if(existeUser) throw new Error("El email ya existe en la base de datos.");
        if(!existeCompany) throw new Error("La empresa no existe");

        try {
            const hashedPassword = await hashPassword(password);

            const createUser = await userRepository.createUser(
                {
                    firstName:firstName,
                    secondName,
                    firstLastName,
                    secondLastName,
                    email:emailNorm,
                    passwordHash: hashedPassword,
                    role,
                    companyId:companyId,
                    isActive: true,
                }
            );

            return{
                success: true,
                message: "Usuario creado exitosamente",
                data: {
                    user: createUser,
                    company: {
                        name:existeCompany.name,
                    },
                }
            }
        } catch (error) {
            console.error("Error al crear empleado", error);
            throw error;
        }
    }

    //obtener todos los usuarios de una empresa por id
    async getUsersByCompanyId(companyId:number){
        try {
            if(!companyId) throw new Error("No se envio el id de compañia");
            const employee = await userRepository.getUsersByIdCompany(companyId);
            if(!employee) throw new Error("No se encontraron empleados.");

            return {
                success: true,
                message:"Empleados obtenidos exitosamente",
                data:employee
            }
            
        } catch (error) {
            console.error("Error al obtener empleados", error);
            throw error;
        }
    }

    //Actualizar usuario empleado
    async updateEmployee(id:number, data: Partial<IUser>) {
        try {
           

            // 1. Verificar que el usuario a actualizar exista
            const userToUpdate = await userRepository.getUserById(id);
            if (!userToUpdate) {
                throw new Error("El usuario que intentas actualizar no existe.");
            }

            // Objeto con los datos que finalmente enviaremos al repositorio para actualizar
            const updateData: Partial<UserPg> = {};

            // 2. Validar y actualizar el email si viene en la petición
            if (data.email) {
                const newEmailNorm = normalizedEmail(data.email);

                // Validar formato del email
                if (!validarEmail(newEmailNorm)) {
                    throw new Error("El nuevo email no es válido.");
                }

                // Si el email es diferente al actual, verificar que no esté en uso por otro
                if (newEmailNorm !== userToUpdate.email) {
                    const existEmail = await userRepository.getUserByEmail(newEmailNorm);
                    if (existEmail) {
                        throw new Error("El email ya está en uso por otro usuario.");
                    }
                    updateData.email = newEmailNorm;
                }
                // Si es el mismo email actual, no hacemos nada (no da error y se mantiene el actual)
            }

            // 3. Mapear el resto de campos si vienen en la petición
            if (data.firstName) updateData.firstName = data.firstName;
            if (data.secondName !== undefined) updateData.secondName = data.secondName;
            if (data.firstLastName) updateData.firstLastName = data.firstLastName;
            if (data.secondLastName !== undefined) updateData.secondLastName = data.secondLastName;
            if (data.role) {
                if (data.role !== "supervisor" && data.role !== "tecnico" && data.role !== "admin") {
                    throw new Error("Rol no válido para empleado.");
                }
                updateData.role = data.role;
            }
            if (data.isActive !== undefined) updateData.isActive = data.isActive;

            // 4. Hashear contraseña si se va a actualizar
            if (data.password) {
                if (!esPasswordValida(data.password)) {
                    throw new Error("La nueva contraseña no es válida.");
                }
                updateData.passwordHash = await hashPassword(data.password);
            }

            // 5. Realizar la actualización en la base de datos
            const updatedUser = await userRepository.updateUser(id, updateData);

            return {
                success: true,
                message: "Usuario actualizado correctamente",
                data: updatedUser
            };

        } catch (error) {
            console.error("Error al actualizar empleado:", error);
            throw error;
        }
    }

    //Eliminar usuario empleados
    async deleteEmployee(id:number){

        const existeUser = await userRepository.getUserById(id);
        if(!existeUser) throw new Error("Usuario no encontrado.");

        try {
            await userRepository.deleteUser(id);
            return{
                success:true,
                message:"Usuario eliminado correctamente",
            };
            
        } catch (error) {
            console.error("Error al eliminar empleado:", error);
            throw error;
        }
    }
}

const userService = new UserService();
export default userService;
