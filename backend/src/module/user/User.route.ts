import { Router } from "express";
import { userController } from "./User.controller";
import { auth } from "../../middleware/auth.middleware";


const router = Router();


router.post("/register",userController.UserCreated);
router.get("/",auth("ADMIN"),userController.getAllUser);
router.patch("/:id",auth("ADMIN"),userController.updateUser);

export const userRote = router;