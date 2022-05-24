const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.npj44.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const toolCollection = client.db('manufacturer_website').collection('tools');
        const purchaseCollection = client.db('manufacturer_website').collection('purchase');
        const reviewCollection = client.db('manufacturer_website').collection('review');


        app.get('/tool', async(req, res) =>{
            const query = {};
            const cursor = toolCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        })

        app.get('/tool/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        })

        app.get('/purchase', async(req, res) =>{
          const email = req.query.email;
          const query = {email: email};
          const purchase = await purchaseCollection.find(query).toArray();
          res.send(purchase);
        })

        app.post('/purchase', async(req, res) =>{
          const purchase = req.body;
          const result = await purchaseCollection.insertOne(purchase);
          res.send(result);
        })

        app.delete('/purchase/:id', async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const result = await purchaseCollection.deleteOne(filter);
          res.send(result);
        })

        app.get('/review', async(req, res) =>{
          const query = {};
          const cursor = reviewCollection.find(query);
          const tools = await cursor.toArray();
          res.send(tools);
      })

        app.post('/review', async(req, res) =>{
          const review = req.body;
          const result = await reviewCollection.insertOne(review);
          res.send(result);
        })
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from tool kit!')
})

app.listen(port, () => {
  console.log(`tool kit app listening on port ${port}`)
})