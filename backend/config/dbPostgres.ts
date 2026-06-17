import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { CompanyPg } from "../models/CompanyPg.js";
import { UserPg } from "../models/UserPg.js";

//Conexio a PostgresSQL ussando Sequelize
dotenv.config({ override: true });

const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5435,
    username: process.env.POSTGRES_USER || "stiven",
    password: process.env.POSTGRES_PASSWORD || "5252",
    database: process.env.POSTGRES_DB || "gosyt_sena",
    models: [CompanyPg, UserPg]
});

//Funcion para conectar y sincronizar la base de datos 
export const connectPostgres = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Conexion exitosa a la base de datos");
        //Sincronizar los modelos con la BD (creara las tablas si no existen)
        await sequelize.sync({ alter: true });
        console.log("Base de Datos sincronizada correctamennte");
    } catch (error) {
        console.error('Error al conectar a la  base de datos: ', error);
        throw error;
    }
};

export default sequelize;