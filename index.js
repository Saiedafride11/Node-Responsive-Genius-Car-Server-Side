const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
// const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
// app.use(bodyParser.json())
// or
app.use(express.json())

// user: mydbuser
// password: kp8CEplf1dBn5QdA

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9lnx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('Hitting Database')
//   // client.close();
// });

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanics");
    const servicesCollection = database.collection("services");

    //GET API
    app.get('/services/', async (req, res) => {
        const cursor = servicesCollection.find({})
        const services = await cursor.toArray();
        res.send(services)
    })
    //GET API
    app.get('/services/:id', async (req, res) => {
       const id = req.params.id;
       const query = { _id: ObjectId(id)};
       const service = await servicesCollection.findOne(query);
      //  res.send(service);
       res.json(service);
    })
    
    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      // console.log('Hit The post api', service)
      const result = await servicesCollection.insertOne(service)
      console.log(result)
      // res.send('post hitted')
      res.json(result)
    })

    // Delete API
    app.delete('/services/:id', async (req, res) => {
       const id = req.params.id;
       const query = { _id: ObjectId(id)};
       const service = await servicesCollection.deleteOne(query);
       res.json(service);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Genius car running')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})