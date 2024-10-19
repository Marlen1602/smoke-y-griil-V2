import mongoose from "mongoose";

const politicaSchema= new mongoose.Schema({
title:{
    type: 'string',
    required: true,
},
descripcion:{
    type: 'string',
    required: true,
},
},{
    timestamps:true
});

export default mongoose.model("politica",politicaSchema);