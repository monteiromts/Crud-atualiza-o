// Biblioteca express
const express = require('express')

//Chamando o Get lá no Atendimento
const consign = require('consign')

//ler os dados que estamos recebendo no body
const bodyParser = require('body-parser')


module.exports = () => {
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Incuir 'controollers' dentro do 'app'
consign()
    .include('controllers')
    .into(app)

return app

}