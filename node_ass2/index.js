
// use node index.j for start the server
//after server started go to the browser -> open a new tab->copy and paste url http://localhost:8080/

const bodyParser = require('body-parser');
const express=require('express');
const mongoose=require('mongoose');
var router=require("./Routes/router");

require('dotenv').config()
var password=process.env.DATABASE_PASS;
const port=8080;
const host="localhost";

var app=express();

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const dbUri=`mongodb+srv://root:${password}@cluster0.29oaz.mongodb.net/UserDb?retryWrites=true&w=majority`;
const options={
    useNewUrlParser:true,
    useUnifiedTopology:true
}
app.use("/",router);
app.set("view engine",'jade')
app.get("/",(req,res)=>{
    res.render("index");
})
mongoose.connect(dbUri,options).then(() =>{
    app.listen(port,()=> console.log(`server running on http://${host}:${port}`));
}).catch((err)=>{
    console.log(err);
})
