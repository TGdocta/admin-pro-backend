
const { response } = require('express')

const Hospital = require('../models/hospital')

const getHospitales = async (req, res = response)=>{

    const hospitales = await Hospital.find()
                                     .populate('usuario','nombre img')

    res.json({
        ok:true,
        hospitales
    })
 
}

const crearHospital = async (req, res = response)=>{

    
    const id = req.id
    const hospital = new Hospital( {
        usuario:id,
        ...req.body 
    });

    try {

       const hospitalDB = await hospital.save()

        res.json({
            ok:true,
            hospital:hospitalDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:true,
            msg:'Hable con el Administrador'
        });
    }

   

}

const actualizarHospital = async (req, res = response)=>{

    const hospitalID = req.params.id
    const usuarioID = req.id
    console.log(usuarioID);

    try {

        const hospitalDB = await Hospital.findById(hospitalID)

        if (!hospitalDB) {
            res.status(404).json({
                ok:false,
                msg:'Hospital no encontrado'
            }) 
        }

      //  hospitalDB.nombre = req.body.nombre;

      const cambiosHospital= {
          ...req.body,
          usuario: usuarioID
      }

      const hospitActualizado = await Hospital.findByIdAndUpdate(hospitalID, cambiosHospital, { new : true })


        res.json({
            ok:true,
            hospital: hospitActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        }) 
    }

   

}

const borrarHospital = async (req, res = response)=>{

    const hospitalID = req.params.id

    try {

        const hospitalDB = await Hospital.findById(hospitalID)

        if (!hospitalDB) {
            res.status(404).json({
                ok:false,
                msg:'Hospital no encontrado'
            }) 
        }

      await Hospital.findByIdAndDelete(hospitalID)


        res.json({
            ok:true,
            msg:'Hospital eliminado'
        })

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        }) 
    }

}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}