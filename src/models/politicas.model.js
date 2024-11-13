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
date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
},{
    timestamps:true
});

export default mongoose.model("politica",politicaSchema);