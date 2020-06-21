var mongoose=require("mongoose");
var productSchema=mongoose.Schema({
    name:String,
    image:String,
    price:Number,
    description:String,
    unit:String
   
   
});
module.exports=mongoose.model("Product", productSchema);
