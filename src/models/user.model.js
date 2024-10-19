import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    nombre: {
        type: String,
        required: true,
        unique: false,
        trim:true
    },
    apellidos: {
        type: String,
        required: true,
        unique: false,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['cliente', 'administrador'], // Solo estos dos roles son válidos
        default: 'cliente',  // Por defecto, todos los usuarios registrados son "clientes"
    },
},{
    timestamps:true
})

export default mongoose.model('User',userSchema)