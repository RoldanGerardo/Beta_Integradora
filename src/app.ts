// Configurar Express
import express from "express";
import cors from "cors";
import movimientoRoutes from "./routes/movimientoRoutes";

const app = express();
app.use(cors());
app.use(express.json());


app.use("/movimientos", movimientoRoutes);

app.get("/", (req, res) => {
    res.json({ mensaje: "Backend Beta funcionando correctamente" });
});

export default app;