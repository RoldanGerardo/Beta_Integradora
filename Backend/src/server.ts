import app from "./app.js";
import { verificarConexion } from "./config/db.js";
import { asegurarAdminInicial } from "./services/usuarioManager.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    await verificarConexion();
    await asegurarAdminInicial();
});