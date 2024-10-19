import Politica from '../models/politicas.model.js'

export const getPoliticas=async (req, res) => {
    const politicas = await Politica.find();
    res.json(politicas);
};

export const createPolitica=async (req, res) => {
    const {title,descripcion}=req.body;

    const newPolitica=new Politica({title,descripcion});
    const savedPolitica = await newPolitica.save();
    res.json(savedPolitica);
};

export const getPolitica=async (req, res) => {
    const politica = await Politica.findById(req.params.id)
    if(!politica) return res.status(404).json({mesage:'politica no encontrada'})
    res.json(politica);
};

export const deletePolitica=async (req, res) => {
    const politica = await Politica.findByIdAndDelete(req.params.id)
    if(!politica) return res.status(404).json({mesage:'Politica no encontrada'})
    return res.sendStatus(204);
};

export const updatePolitica=async (req, res) => {
    const politica = await Politica.findByIdAndUpdate(req.params.id,req.body,{
        new:true
    })
    if(!politica) return res.status(404).json({mesage:'Politica no encontrada'})
    res.json(politica); 
};

