const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

//define the app
const app = express()
app.use(cors())
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/history', require('./api/route'))

//listen the server
const PORT = 4444
const MONGO_DB = `connection string`


app.listen(PORT, () => {
    console.log("App is running");
    mongoose.connect(MONGO_DB)
        .then(response => {
            console.log("DB is connected");
        })
        .catch(e => {
            console.log(e.message); 
        })
})

module.exports = app