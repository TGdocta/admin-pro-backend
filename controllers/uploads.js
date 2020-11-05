const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const { actualizarIMG } = require("../helpers/actualizar-img");
const fs = require('fs')




const fileUpload = (req, res = response) =>{

    const tipo = req.params.tipo;
    const id   = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios']

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok:false,
            msg:'No es un medico , hosptal u Usuario (tipo)'
        })
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'No se selecciono ningun archivo'
        })
      }

    //procesar la imagen . . .
    const file = req.files.imagen;


    const nombreCortado = file.name.split('.')
    const extensionArchivo = nombreCortado[nombreCortado.length -1]

    //validar extension
    const extensionesValidas = ['png','jpg','jpeg','gif','pdf']

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok:false,
            msg:'No es una extension permitida'
        })
    }

    //Generar nombre del archivo
    const nombreArchivo =`${uuidv4()}.${extensionArchivo}`

    //path para gardar imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`

    // mover la imagen
  file.mv(path, (err) =>{
    if (err){
        return res.status(500).json({
            ok:false,
            msg:'error al mover la imgen'
        });

    }

    //actualizar BD
    actualizarIMG(tipo,id,nombreArchivo);

    res.json({
        ok:true,
        msg:'archivo subido',
        nombreArchivo

    })

  });

  

}

const retornaIMG = (req , res = response) =>{
    const tipo = req.params.tipo;
    const foto   = req.params.foto;

    const pathIMG = path.join(__dirname,`../uploads/${tipo}/${foto}`)
    if (fs.existsSync(pathIMG)) {
        res.sendFile(pathIMG)
        
    }else{
        const pathIMG = path.join(__dirname,`../uploads/no-img.png`)
        res.sendFile(pathIMG)
    }
}

/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads')); */

module.exports = {
    fileUpload,
    retornaIMG
}