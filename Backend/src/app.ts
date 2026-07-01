// Configurar Express
import express from "express";
import cors from "cors";
import movimientoRoutes from "./routes/movimientoRoutes";
import educativoRoutes from "./routes/educativoRoutes";
import informesRoutes from "./routes/informesRoutes";
import crudRoutes from "./routes/CRUDRoutes";

const app = express();
app.use(cors());
app.use(express.json());

//rutas conectadsd
app.use("/movimientos", movimientoRoutes);
app.use("/educativo", educativoRoutes);
app.use("/informes", informesRoutes);
app.use("/admin", crudRoutes);
app.get("/", (req, res) => {
    res.json({ mensaje: "Backend Beta funcionando correctamente" });
});

export default app;