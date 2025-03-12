import {z} from "zod";

export const registerSchema=z.object({
    username:z.string({
        required_error:"el nombre de usuario es requerido"
    }),
    nombre:z.string({
        required_error:"el nombre del usuario es requerido"
    }),
    apellidos:z.string({
        required_error:"los apellidos del usuario es requerido"
    }),
    email:z.string({
        required_error:"Email es requerido"
    }),
    password:z.string({
        required_error:"Contraseña es requerida"
    })
});

export const loginSchema=z.object({
    email:z.string({
        required_error:"Email es requerido"
    }),
    password:z.string({
        required_error:"Contraseña es requerida"
    }).min(8,{
        message:"La contraseña debe tener al menos 8 caracteres"
    }),
});