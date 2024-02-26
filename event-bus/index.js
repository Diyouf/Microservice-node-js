const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParse = require('body-parser')
const app = express()

app.use(bodyParse.json())


app.post('/events',(req,res)=>{
    const event = req.body

    axios.post('http://localhost:3000/events',event)
    axios.post('http://localhost:3001/events',event)
    axios.post('http://localhost:3002/events',event)

    res.send({status:'ok'})

})
app.listen(3005,()=>{
    console.log('server running at 3005')
})