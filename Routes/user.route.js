import { Router } from "express";
import AuthController from '../Controllers/AuthContoller.js' ; // Import the default export

const router = Router();

router.post("/login", AuthController.Login); // Accessing Login method from the imported object
router.post("/signup", AuthController.Signup); // Accessing Signup method from the imported object

export { router };
