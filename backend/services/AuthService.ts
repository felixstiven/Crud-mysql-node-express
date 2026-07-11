
import sequelize from "../config/dbPostgres.js";
import companyRepository from "../repository/CompanyRp.js";
import userRepository from "../repository/UserRp.js";
import { IUser, ILogin } from "../dt/interfaces.js";
import {
    validarEmail,
    normalizedEmail,
    esPasswordValida,
    hashPassword,
    comparePassword
} from "../utils/validators.js";

class AuthService {
    //Crear usuario owner y empresa
    async registerOwnerandCompany(data: IUser) {
        try {
            // desestructuracion de datos
            const {
                company,
                firstName,
                secondName,
                firstLastName,
                secondLastName,
                email,
                password,
            } = data;

            //Verificar datos obligatorios
            console.log("datos-recibidos", data);
            if (!company.companyName || !firstName || !firstLastName || !email || !password) throw new Error("Datos obligatorios no proporcionados.");

            //Normalizar y Verificar que el email sea valido 
            const emailNorm = normalizedEmail(email);
            if (!validarEmail(emailNorm)) throw new Error("Email no valido.");

            //Verificar contraseña
            if (!esPasswordValida(password)) throw new Error("Password no es valido.");

            //Verificar si existe el email en la base de datos
            const existeUser = await userRepository.getUserByEmail(emailNorm);
            if (existeUser) throw new Error("El email ya existe.");

            //Verificar si nombre de la empresa existe
            const existeCompany = await companyRepository.getCompanyByName(company.companyName);
            if (existeCompany) throw new Error("Nombre de La empresa ya existe");

            //crear la transaccion 
            const transaction = await sequelize.transaction();

            try {

                const fechaFinalTrial = new Date();
                fechaFinalTrial.setDate(fechaFinalTrial.getDate() + 20);
                fechaFinalTrial.toLocaleDateString("es-CO");

                //1) Crear la empresa
                const newCompany = await companyRepository.createCompany(
                    {
                        companyName: company.companyName,
                        trialExpiresAt: fechaFinalTrial,
                    },
                    transaction
                );
                //2)Hashear password
                const hashedPassword = await hashPassword(password);

                //3) crear el ususario
                const user = await userRepository.createUser(
                    {
                        firstName: firstName,
                        secondName,
                        firstLastName,
                        secondLastName,
                        email: emailNorm,
                        passwordHash: hashedPassword,
                        role: "owner",
                        companyId: newCompany.id
                    },
                    transaction
                );
                await transaction.commit();
                //Rtornar la repuesta al ususario creado
                return {
                    success: true,
                    message: "Usuario y empresa creados correctamente",
                    data: {
                        user: user,
                        company: newCompany
                    }
                }

            } catch (error) {
                await transaction.rollback();
                throw error;
            }

        } catch (error) {
            console.error("Error al crear usuario y empresa...", error);
            throw error;
        }
    }

    //Login para usuarios ya registrados
    async Login(data: ILogin) {
        //Destructuracion de datos
        const { email, password } = data;
        console.log("datos-login", data)

        try {


            //Verificar que lleguen todos Los campos 
            if (!email || !password) throw new Error("Email y contraseña son requeridas.");

            //Normalizar el correo 
            const emailNorm = normalizedEmail(email);

            //Verificar email valido 
            if (!validarEmail(emailNorm)) throw new Error("Email no valido.");

            //Verificar contraseña sea validad
            if (!esPasswordValida(password)) throw new Error("La contraseña debe tener almenos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial.");

            //Verificar si el usuario existe
            const user = await userRepository.getUserByEmail(emailNorm);
            if (!user) throw new Error("Email o contraseña incorrecta.");

            //Comparar password
            const passwordMatch = await comparePassword(password, user.passwordHash);
            if (!passwordMatch) throw new Error("Email o contraseña incorrecta");


            //Verificar que el usuario este activo 
            if (!user.isActive) throw new Error("Usuario no activo");

            //retornar los datos del usuario para la entrada al sistema 
            return {
                success: true,
                message: "Usuario logueado correctamente",
                data: {
                    user: user,
                    company: user?.company
                }
            };
        } catch (error) {
            console.error("Error al iniciar sesion: ", error);
            throw error;
        }
    };
}

const authService = new AuthService();
export default authService;