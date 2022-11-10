const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middle ware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Lawyer service')
})
console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ue2o2me.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('personalLawyer').collection('services')
        const serviceCollections = client.db('personalLawyer').collection('service')
        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollections.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            const services = await serviceCollections.findOne(query)
            res.send(service || services)
        })
    }
    finally {

    }
}
run().catch(error => console.error(error))


app.listen(port, () => {
    console.log(`Personal lawyer server running ${port}`)
})