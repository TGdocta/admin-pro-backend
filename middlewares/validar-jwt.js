const jwt = require("jsonwebtoken")


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

module.exports = {

    validarJWT

}


