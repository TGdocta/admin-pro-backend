const { response } = require('express')
const Usuario = require('../models/usuario')
const bcrypt  = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenu } = require('../helpers/menu-frontend');




const login = async(req , res = response) =>{

    const { email , password } = req.body;

    try {

        //verificar email
        const usuarioDB = await Usuario.findOne({email});

        if (!usuarioDB) {
            return  res.status(404).json({
                ok:false,
                msg:'Email no encontrado'
            });
        }

        //verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return  res.status(404).json({
                ok:false,
                msg:'Contraseña no valida'
            });
        }

        //Generar el TOKEN - JWT
 
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok:true,
            token,
            menu: getMenu(usuarioDB.role)
        }); 

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Hable con el Administrador'
        });
    }

}

const googleSingIn = async ( req , res = response)=>{

    const googleToken = req.body.token;

    try {

         const { name, email , picture } = await googleVerify(googleToken)
        console.log(googleToken);
         const usuarioDB = await Usuario.findOne({email})
         let usuario;

         if (!usuarioDB) {
             usuario = new Usuario({
                 nombre:name,
                 email,
                 password:'@@@',
                 img:picture,
                 google:true
             })
         }else{
             usuario = usuarioDB;
             usuario.google = true
            /*  usuario.password = true */
         }

         await usuario.save();

          //Generar el TOKEN - JWT
 
        const token = await generarJWT( usuario.id );

        res.json({
            ok:true,
            token,
            menu: getMenu( usuario.role )
        });
        
    } catch (error) {

        res.status(401).json({
            ok:false,
            msg:'Token no es correcto',
            
        });
        
    }

   

}

const renewToken = async (req , res = response) =>{

    const id = req.id

    const token = await generarJWT( id );

    const usuario = await Usuario.findById(id)

    res.json({
        ok:true,
        token,
        usuario,
        menu: getMenu( usuario.role )
    })

}

module.exports= {
    login,
    googleSingIn,
    renewToken
}