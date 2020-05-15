var mongoose=require("mongoose");

var RequestSchema=mongoose.Schema({
    text:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String,
        email:String,
        
    },
    To:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Constructor"
        },
        name:String,
        email:String
    }
});
module.exports=mongoose.model("Request", RequestSchema);