const express = require("express");
const route = require("../router/route");
const mongoose = require("mongoose");


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

require('dotenv').config();
const { PORT, MONGODB_URL } = process.env


mongoose.connect(MONGODB_URL, {
    useNewUrlParser : true
}).then(()=> console.log("Database Connected!"))
.catch(error => console.log(error))

app.use("/", route);

app.listen(PORT, ()=> {
    console.log("app is running on: "+ PORT);
})


 