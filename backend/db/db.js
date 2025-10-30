const mongoose=require("mongoose");
function connectDb(){
    return mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("mongoDB connected");
    })
    .catch((err)=>{
        console.log("connection error in mongoDB",err);
        throw err;  
    })
}

module.exports=connectDb;