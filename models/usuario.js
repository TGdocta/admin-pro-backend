const { Schema , model  } = require('mongoose')

const UsuarioSchema = Schema({

    nombre:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
    },
    img:{
        ype: String,
    },
    role:{
        type: String,
        required:true,
        default: 'USER_ROLE'
    },
    goole:{
        type:Boolean,
        default:false
    },

});

UsuarioSchema.method('toJSON', function(){
    const { __v, _id,password, ...object } = this.toObject()

    object.id = _id

    return object
})


module.exports = model('Usuario', UsuarioSchema)






