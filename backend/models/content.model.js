const mongoose=require('mongoose');

const contentSchema =new mongoose.Schema({
    Header:{
        type:String,
        required:true
    },
    content:{
        type:String
    },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

const contentModel=mongoose.model("content",contentSchema);
module.exports=contentModel