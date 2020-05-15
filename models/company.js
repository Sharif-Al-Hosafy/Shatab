var mongoose=require("mongoose");
var companySchema=mongoose.Schema({
    name:String,
    image:String,
    descr:String,
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        
        }
    ]
});




module.exports=mongoose.model("Company", companySchema);