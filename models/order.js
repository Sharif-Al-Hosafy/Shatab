var mongoose=require("mongoose");

var orderSchema=new mongoose.Schema({
    user:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        //username:String
    },
    cart:Object,
    city:String,
    region:String,
    address:String, 
    mobilenumber:String
    

    
});
module.exports=mongoose.model("Order", orderSchema);