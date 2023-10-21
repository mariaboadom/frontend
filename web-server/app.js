
//npm run dev

const express = require ('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cors = require ('cors')


const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false}))//entender los datos de un formulario html
app.set('port',process.env.PORT || 4000);//el process.env sirve para por si en nuestro so hay algo predefinido para eso
app.use(morgan('dev'))
app.use(cors());
app.use("/hola",require('./routes'))

module.exports = app;