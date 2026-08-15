import dotenv from "dotenv";
dotenv.config({ override: true });

import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { connectPostgres } from "./src/config/dbPostgres.js";
import routerAuth from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

//Iniciar Express
const app: Application = express();

//cors para que el frotend pueda hacer las peticiones
app.use(cors());

app.use(express.json());

//Rutas Authenticacion
app.use("/api/auth", routerAuth);

//Rutas Crud Empleaods
app.use("/api/users", userRoutes);


//puerto 
const PORT = process.env.PORT || 3520;

//Funcion para iniciar Postgres
const startPostgres = async () => {
    try {
        await connectPostgres();
    } catch (error) {
        console.log("Error al conectar a la base de datos: ", error)
    }
}

startPostgres();

//Middleware para manejar errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Error interno del servidor";

    res.status(status).json({
        success: false,
        message: message
    })
})

//Inicio del servidor
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto: ", PORT)
});