const express=require('express')
const cors = require('cors');


require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express()
const port=process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//coonnection of uri
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.stkfkwf.mongodb.net/?appName=Cluster1`;


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
    const db = client.db('bookHavenDB');
    const booksCollection = db.collection('books');
    const usersCollection = db.collection('users');

    // Send a ping to confirm a successful connection
    
    app.get('/',(req,res)=>{
        res.send('Book Haven API is running')})

      
    //add new book
   app.post('/add-book',async(req,res)=>{
    const newbook = { ...req.body, createdAt: new Date() };
    const result = await booksCollection.insertOne(newbook);
    res.send(result);

   })

 
app.get('/latest-books', async (req,res) => {
  const books = await booksCollection
    .find()
    .sort({ _id:1}).limit(6).toArray();
    res.send(books);
});


   app.get('/all-books', async (req,res)=>{
  const books = await booksCollection.find().toArray();
  res.send(books);
});
  const { ObjectId } = require('mongodb');
app.get('/book-details/:id', async (req,res)=>{
  const id = req.params.id;
  const book = await booksCollection.findOne({ _id: new ObjectId(id) });
  res.send(book);
});
app.put('/update-book/:id', async (req,res)=>{
  const id = req.params.id;
  const update = req.body;
  const result = await booksCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );
  res.send(result);
});


app.delete('/delete-book/:id', async (req,res)=>{
  const id = req.params.id;
  const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
  res.send(result);
});

app.get("/my-books", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userBooks = await booksCollection.find({ userEmail: email }).toArray();
    res.send(userBooks);
  } catch (error) {
    console.error("Error fetching user books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  }
  finally{
   

  }
}
run().catch(console.dir);

app.listen(port,(req,res)=>{
    console.log(`Server is running on ${port}`)
})
