import { Router } from "express";
import { CategoryController } from "./Categories.controller";
import { auth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/categories",CategoryController.getAllCategory);
router.post("/categories",auth("ADMIN"),CategoryController.createCategory);
router.put("/categories/:id",auth("ADMIN"),CategoryController.updateCategory);
router.delete("/categories/:id",auth("ADMIN"),CategoryController.deleteCategory);

export const CategoryRoute = router;