const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { readdirSync } = require('fs')
const cors = require('cors')
const cookieParser = require('cookie-parser');


app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(cookieParser());



readdirSync('./routers')
.map((p)=> app.use('/api',require('./routers/'+p)))



app.listen(5000,()=>console.log('Server is running on port 5000 eiei'))