const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { connectDB, closeDB, client } = require("./db/database");
const { ObjectId } = require("mongodb");


connectDB();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static("views"));
app.use(express.static("style"))
app.set("view engine", "ejs");


app.get("/kerja-projek" , async(req,res) => {
  res.render("index");
})


app.post("/feedback", async(req,res) => {
    const { name,email,message,time} = req.body;
    const bd = await client.db("ceysardb");
    const cd = await bd.collection("feedback");
    await cd.insertOne({ name, email, message,time});
})



app.get("/admin", async(req,res)=> {
   const db = await client.db("ceysardb");
   const cd = await db.collection("feedback");
   const data = await cd.find({}).toArray();
   res.render("admin", {data});
})


app.delete("/delete", async(req,res)=> {
    
  const {id}= req.body;
  console.log(id);
  const db = await client.db("ceysardb");
  const cl= await db.collection("feedback");
  const dl = await cl.deleteOne({_id: new ObjectId(id)});
  console.log(dl.deletedCount);
  res.send(req.body);
})







process.on('SIGINT', async () => {
    await closeDB();
    process.exit();
  });
  

app.listen(port, () => {
    console.log(`berhasil masuk di port ${port}`);
})