import { Router } from "express";
const router = Router();
router.get("/admin", (req, res) => {
  res.send("Apartado de CRUD funcionando correctamente");
});
export default router;