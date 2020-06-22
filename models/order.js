var mongoose=require("mongoose");

var orderSchema=new mongoose.Schema({
    cart:Object,
    city:String,
    region:String,
    address:String, 
    mobilenumber:String
    

    
});
module.exports=mongoose.model("Order", orderSchema);