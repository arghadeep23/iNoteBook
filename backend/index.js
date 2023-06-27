const mongoose=require('mongoose');
const notes=require('./models/Notes');
mongoose.connect('mongodb://127.0.0.1:27017/inotebook',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db=mongoose.connection; 
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
const express=require('express');
const app=express(); 
app.use(express.json());
// Available routes
app.use('/api/auth',require('./routes/auth'))
// app.use('/api/notes',require('./routes/notes'))
app.get('/',(req,res)=>{
    res.send('Hello stranger');
})
app.listen(5000,()=>{
    console.log('Serving on port 5000');

})