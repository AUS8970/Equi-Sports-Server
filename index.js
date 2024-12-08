const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yn4cz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    app.get('/coffee', async(req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(quary);
      res.send(result)
    })

    // create by post
    app.post('/coffee', async(req, res)=> {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    });

    // update by put
    app.put('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name, 
          chef: updatedCoffee.chef, 
          supplier: updatedCoffee.supplier, 
          taste: updatedCoffee.taste, 
          category: updatedCoffee.category, 
          details: updatedCoffee.details ,
          price: updatedCoffee.price,
          photo: updatedCoffee.photo,
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result)
    })

    // delete by delete
    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(quary)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Coffee making coltece")
});

app.listen(port, () => {
  console.log(`Coffee Server is running on port: ${port}`)
});