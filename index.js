//1
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//3
const cors = require('cors');
require('dotenv').config()

//4 middleware 
app.use(cors())
app.use(express.json())

//5 mongo 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntqc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//6 
async function run() {
    try {
        //7 
        await client.connect();
        const serviceCollection = client.db("volunteer").collection("service");

        // 8 get
        app.get('/service' , async(req,res) => {
            const query = {} 
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        // get single service details 
        app.get('/service/:id' , async(req,res) => {
            const id = req.params.id 
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

    } 
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



//2
app.get('/', (req, res) => {
    res.send('Good wish server runinig ')
})
app.listen(port, () => {
    console.log('good wish is running ', port);
})