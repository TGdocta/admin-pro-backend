
const { response } = require('express')
const Medicos = require('../models/medico')

const getMedicos = async (req, res = response)=>{

    const medicos = await Medicos.find()
                                 .populate('usuario','nombre img')
                                 .populate('hospital','nombre img')


    res.json({
        ok:true,
        medicos
    })

}

const crearMedicos = async (req, res = response)=>{
    const id = req.id
    const medico = new Medicos( {
        usuario:id,
        ...req.body 
    });

    try {

        const medicoDB = await medico.save()

        res.json({
            ok:true,
            hospital:medicoDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:'Hable con el Administrador'
        });
    }


}

const actualizarMedicos = (req, res = response)=>{

    res.json({
        ok:true,
        msg:'actualizarMedicos'
    })

}

const borrarMedicos = (req, res = response)=>{

    res.json({
        ok:true,
        msg:'borrarMedicos'
    })

}

module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    borrarMedicos
}