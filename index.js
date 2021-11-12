const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const { MongoClient } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000;










app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvsmm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run(){


    try{
        await client.connect();
        const database = client.db('rodiar_bike');
        const bikesCollection = database.collection('bikes');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');


      

        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result =await ordersCollection.insertOne(order);
            res.json(result)
        })

       



        app.get('/bikes', async (req, res )=>{
        
            const cursor = bikesCollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes);
           
        });
    
        // get single bike
        app.get('/bikes/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const bike = await bikesCollection.findOne(query);
            res.json(bike);
            
        });
    
    
         app.get('/single-order/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const bike = await ordersCollection.findOne(query);
            res.json(bike);
            
        })
    
        // add order api 
        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })
    
        // user order 
        app.get('/orders/:id', async (req, res) =>{
            const uid =[req.params.id];
            const query = {uid: {$in: uid}};
            const result = await ordersCollection.find(query).toArray();
            res.json(result);
        })
        // post api 
        app.post('/bikes', async(req, res) =>{
    
            const bike = req.body;
            console.log('hit the api', bike);
            
        const result = await bikesCollection.insertOne(bike);
        console.log(result);
        res.json(result);
        res.send('post hitted');
        });
    
        // order manage api 
            app.get('/all-orders', async (req, res )=>{
            
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
           
        });
    
        // put api 
        app.put('/order-status/:id', async(req, res) =>{
            const id = req.params.id;
            const order = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
             $set: {
                status: order.status
            },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
    
    
    
        // delete orders by admin
    
        app.delete('/order/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })


         // delete product by admin
    
         app.delete('/bikes/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bikesCollection.deleteOne(query);
            res.json(result);
        })
    

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/',(req, res) =>{
    res.send('Hello Rodiar Bike')

})

app.listen(port, ()=>{
    console.log(`listening at ${port}`)
})



