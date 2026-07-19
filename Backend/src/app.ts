import express, { Request, Response } from "express"; // <-- Importamos los tipos de Express
import cors from "cors";

// 🛠️ Corrección: Agregamos el ".js" al final de cada ruta local para cumplir con NodeNext
import movimientoRoutes from "./routes/movimientoRoutes.js";
import educativoRoutes from "./routes/educativoRoutes.js";
import informesRoutes from "./routes/informesRoutes.js";
import crudRoutes from "./routes/CRUDRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminUsuariosRoutes from "./routes/adminUsuariosRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas conectadas correctamente
app.use("/movimientos", movimientoRoutes);
app.use("/educativo", educativoRoutes);
app.use("/informes", informesRoutes);
app.use("/admin", crudRoutes);
app.use("/auth", authRoutes); // <-- Tu nuevo registro ahora vive en http://localhost:3000/auth/register
app.use("/admin/usuarios", adminUsuariosRoutes);
app.use("/admin/dashboard", adminDashboardRoutes);

// 🛠️ Corrección: Agregamos los tipos Request y Response para eliminar el error estricto
app.get("/", (req: Request, res: Response) => {
  res.json({ mensaje: "Backend Beta funcionando correctamente" });
});

export default app;