const Usuario = require('../models/usuario')
const { response } = require('express')
const bcrypt  = require('bcryptjs');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
/* const { delete } = require('../routes/usuarios'); */


const getUsuarios = async(req , res = response ) => {

    const usuarios = await Usuario.find({}, 'nombre email role google' );
  

    res.json({
        ok:true,
        usuarios,
        id:req.id
    })

}

const crearUsuarios = async (req , res = response ) => {

    const { email , password , nombre } = req.body;



    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya esta registrado'
            });
        }
        
        const usuario = new Usuario( req.body )

        //encriptar conctraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt )

        await usuario.save();
        const token = await generarJWT( usuario.id );

         res.json({
             ok:true,
             usuario,
             token
         })
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Error revisar logs'
        })
    }

 

}

const actualizarUsuario = async (req , res = response) => {

    const id = req.params.id
  

    try {

        const usuarioDB = await usuario.findById(id)

        if (!usuarioDB) {
            res.status(404).json({
                ok:false,
                msg:'no Existe un usuario por ese id'
            })
        }

        const {password, google , email , ...campos} = req.body;

        if (usuarioDB.email !== email) {
        

            const existeEmail = await Usuario.findOne({email})
            if (existeEmail) {
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un usuairo con ese Email'
                });
            }

        }

        campos.email = email

        const usuarioActualizado = await Usuario.findByIdAndUpdate( id, campos, { new: true } );

        res.json({
            ok:true,
            usuarioActualizado

        });
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        });
    }

}

const borrarUsuario = async(req , res = response) =>{

    const id = await req.params.id

    try {
        const usuarioDB = await usuario.findById(id)

        if (!usuarioDB) {
            res.status(404).json({
                ok:false,
                msg:'no Existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete(id);

        res.json({
            ok:true,
            msg:'Usuario Eliminado'
        })
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el Administrador'
        });
    }

}



module.exports={
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}


