const mongoose=require('mongoose')
const http=require('http')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})

const DB=process.env.DATABASE
mongoose
  .connect(DB)
  .then((con) => {
    console.log('DB connection Successfully');
  });

const app =require('./app')

const server=http.createServer(app);


const port=process.env.PORT||5000

server.listen(port,()=>{
    console.log(`server is Running in port ${port}`)
})