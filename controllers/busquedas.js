const { response } = require('express')
const Usurio = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')

const getTodo = async (req, res = response)=>{

 
    const busqueda  =  req.params.busqueda;
    const rex = new RegExp(busqueda, 'i');


    const [usuarios,medicos,hospitles] = await Promise.all([
        Usurio.find({  nombre: rex }),
        Medico.find({  nombre: rex }),
        Hospital.find({  nombre: rex })
    ])



    res.json({
        ok:true,
        usuarios,
        medicos,
        hospitles
    })
 
}

const getDocumentosColeccion = async (req, res = response)=>{

 
    const tabla     =  req.params.tabla;
    const busqueda  =  req.params.busqueda;
    const rex       = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({  nombre: rex })
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')
            break;
        case 'hospitales':
            data = await Hospital.find({  nombre: rex })
                                 .populate('usuario','nombre img')
            break;
        case 'usuarios':
            data = await Usurio.find({  nombre: rex })
                               .populate('usuario','nombre img')
            break;
        default:
           return res.status(400).json({
                ok:false,
                msg:'la busqueda debe coincidir con : hospitales/medicos/usuarios'
            });

        
       
    }


    res.json({
        ok:true,
        resultados: data
    });
 
}



module.exports={
    getTodo,
    getDocumentosColeccion
}