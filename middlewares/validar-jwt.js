const jwt = require("jsonwebtoken")
const { findById } = require("../models/usuario")
const usuario = require ("../models/usuario")


const validarJWT = (req , res , nex)=>{

    //leer el token
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok:false,
            msg:'No hay token en la peticion'
        })
    }

    try {

        const { id } = jwt.verify( token, process.env.JWT_SECRET )
        req.id = id

        nex();
        
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg:'Token Icorrecto'
        })
    }


  

}

const valirdarADMIN_ROLE = async (req ,res ,next) =>{ 

    const id = req.id

    try {

        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg:'usuario no existe'
            })
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok:false,
                msg:'No tiene privilegios'
            })
        }

        next()
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'hable con el administrador'
        })
    }


}

const valirdarADMIN_ROLE_o_mismoUsuario = async (req ,res ,next) =>{ 

    const id = req.id
    const idx = req.params.id

    try {

        const usuarioDB = await Usuario.findById(id);

        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg:'usuario no existe'
            })
        }

        if ( usuarioDB.role === 'ADMIN_ROLE' || id === idx ) {
        
            next();
            
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

   
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'hable con el administrador'
        })
    }


}

module.exports = {

    validarJWT,
    valirdarADMIN_ROLE,
    valirdarADMIN_ROLE_o_mismoUsuario

}


