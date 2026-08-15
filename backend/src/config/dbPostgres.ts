import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { CompanyPg } from "../models/CompanyPg.js";
import { UserPg } from "../models/UserPg.js";

//Conexio a PostgresSQL ussando Sequelize
dotenv.config({ override: true });

const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || "stiven",
    password: process.env.POSTGRES_PASSWORD || "5252",
    database: process.env.POSTGRES_DB || "gosyt_sena",
    models: [CompanyPg, UserPg]
});

//Funcion para conectar y sincronizar la base de datos 
export const connectPostgres = async (retries = 10, delayMs = 2000): Promise<void> => {
    let attempt = 0;

    while (attempt < retries) {
        try {
            await sequelize.authenticate();
            console.log("Conexion exitosa a la base de datos");
            //Sincronizar los modelos con la BD (creara las tablas si no existen)
            await sequelize.sync({ alter: true });
            console.log("Base de Datos sincronizada correctamennte");
            return;
        } catch (error) {
            attempt += 1;

            if (attempt >= retries) {
                console.error('Error al conectar a la  base de datos despues de varios intentos: ', error);
                throw error;
            }

            console.warn(`Esperando a PostgreSQL... intento ${attempt}/${retries}`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
};

export default sequelize;