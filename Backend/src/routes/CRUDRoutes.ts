import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  res.send("Apartado de CRUD funcionando correctamente");
});
export default router;