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
        const donationCollection = client.db("volunteer").collection("donation");

        // 8 get
        app.get('/service' , async(req,res) => {
            const query = {} 
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        //9 get single service details 
        app.get('/service/:id' , async(req,res) => {
            const id = req.params.id 
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        //10 add new service (POST) CRUD ==> C create 
        app.post('/service' , async(req,res) => {
            const service = req.body 
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })

        //11 delete 
        app.delete('/service/:id' , async(req,res) => {
            const id = req.params.id 
            const query = {_id:ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })

        //12 update 
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id
            const updatedCause = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updatedCause.title,
                    date : updatedCause.date,
                    description : updatedCause.description,
                    img : updatedCause.img
                },
            };
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            console.log(result);

        })

        //13 donation 
        // get donation (post api)
        app.post('/donation' , async(req,res) => {
            const donation = req.body 
            const result = await donationCollection.insertOne(donation)
            res.send(result)
        })

        // load donation (get Create)
        app.get('/donation' , async(req,res) => {
            const email = req.query.email ;
            const query = {email : email} 
            const cursor = donationCollection.find(query)
            const donations = await cursor.toArray()
            res.send(donations)
        })



    } 
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



//2
app.get('/', (req, res) => {
    res.send('Good wish server running ')
})
app.listen(port, () => {
    console.log('good wish is running ', port);
})