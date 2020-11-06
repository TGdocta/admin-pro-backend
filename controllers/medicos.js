
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

const actualizarMedicos = async (req, res = response)=>{

    const medicoID = req.params.id
    const usuarioID = req.id

    try {

        const medicoDB = await Medicos.findById(medicoID)

        if (!medicoDB) {
            res.status(404).json({
                ok:false,
                msg:'Medico no encontrado'
            }) 
        }

      //  hospitalDB.nombre = req.body.nombre;

      const cambiosMedico= {
          ...req.body,
          usuario: usuarioID
      }

      const medicoActualizado = await Medicos.findByIdAndUpdate(medicoID, cambiosMedico, { new : true })


        res.json({
            ok:true,
            medico: medicoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        }) 
    }

}

const borrarMedicos = async (req, res = response)=>{

 
    const medicoID = req.params.id

    try {

        const medicoDB = await Medicos.findById(medicoID)

        if (!medicoDB) {
            res.status(404).json({
                ok:false,
                msg:'Hospital no encontrado'
            }) 
        }

      await Medicos.findByIdAndDelete(medicoID)


        res.json({
            ok:true,
            msg:'Medico eliminado'
        })

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        }) 
    }
}

module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    borrarMedicos
}