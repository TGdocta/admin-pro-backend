require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require ('./DB/config');


//crear servidor de express
const app = express()

//configurar CORS
app.use(cors())


//DB
dbConnection()

app.get( '/', (req , res) => {

    res.json({
        ok:true,
        msg:'hola mundo'
    })

} );


app.listen( process.env.PORT, ()=>{
    console.log(`servidor corriendo en puerto : ${process.env.PORT}`);
} )


