const { Router } = require('express');
const { getUsuarios , crearUsuarios , actualizarUsuario, borrarUsuario} = require('../controllers/usuarios')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, valirdarADMIN_ROLE ,valirdarADMIN_ROLE_o_mismoUsuario} = require('../middlewares/validar-jwt');
 
const router = Router();

router.get( '/',validarJWT,getUsuarios  );

router.post( '/', 
  [
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('password', 'El nombre es Obligatorio').not().isEmpty(),
    check('email', 'El nombre es Obligatorio').isEmail(),
    validarCampos
  ],
 crearUsuarios
);


router.put( '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('email', 'El email es Obligatorio').isEmail(),
    check('role', 'El role es Obligatorio').not().isEmpty(),
    validarCampos
    
  ],
  actualizarUsuario 
 
);

router.delete('/:id',[validarJWT],borrarUsuario)







module.exports = router;