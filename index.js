const express =require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000
const cors = require('cors');


//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xn4aldo.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection =client.db('coffeeDB').collection('coffee')

    app.get('/coffee', async(req, res)=>{
        const cursor =coffeeCollection.find()
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/coffee/:id', async(req, res)=>{
        const id =req.params.id;
        const query = { _id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result)
  
      })

    app.post('/coffee', async(req, res)=>{
        const newcoffee =req.body;
        console.log( newcoffee);
        const result = await coffeeCollection.insertOne(newcoffee);
        res.send(result);
      })
//update part
      app.put('/coffee/:id', async(req, res) => {
        const id =req.params.id;
        const updatedCoffee=req.body;
        const filter = { _id: new ObjectId(id)};
        const option ={upsert: true};
        const coffee ={
          $set: {
            name: updatedCoffee.name,
            quantity: updatedCoffee.quantity,
            supplier: updatedCoffee.supplier,
            taste: updatedCoffee.taste,
            category: updatedCoffee.category,
            details: updatedCoffee.details,
            photo: updatedCoffee.photo,
            
          }
        }
        const result = await coffeeCollection.updateOne(filter, coffee, option);
       res.send(result)
      })
//delete part
      app.delete('/coffee/:id', async(req, res)=>{
        const id =req.params.id;
        
        const query = { _id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
  
      })
  

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Simple crud is running')
  })
  
  app.listen(port, () => {
    console.log(`Simple crud is running on port ${port}`)
  })
  