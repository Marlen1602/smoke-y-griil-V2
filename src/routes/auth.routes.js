import { Router } from "express";
import { login,register,logout,profile,validateRegister,unlockUser,blockUser} from "../controllers/auth.controller.js";
import {authRequired} from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema,loginSchema } from "../schemas/auth.schema.js";
import {verifyEmail} from "../controllers/emailVerification.controller.js"
import { getUserByEmail, updatePassword,getUsers } from "../controllers/users.controller.js";
import { sendCodeForReset, verifyCode } from "../controllers/codeVerification.controller.js";

const router = Router();

router.post("/register",validateSchema(registerSchema) ,validateRegister,register);

router.post("/login", validateSchema(loginSchema), login);
// router.post("/login", login);

router.post("/verify-email", verifyEmail);

router.post("/logout",logout);

router.get("/profile", authRequired, profile);

router.put('/unlock/:id', unlockUser);
router.put('/block/:id', blockUser);


router.get("/authenticated", authRequired, (req, res) => {
    res.json({ message: "Authenticated" });
});

router.get('/logout', logout);


router.get('/users/:email', getUserByEmail)

router.post('/email-reset-password', sendCodeForReset)
router.post('/verify-code-password', verifyCode)

router.put('/update-password', updatePassword)

router.get('/usuarios',getUsers)






export default router