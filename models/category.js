var mongoose=require("mongoose");
var categorySchema=mongoose.Schema({
    name:String,
    image:String,
    desc:String,
    companyname:[
        {
                
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Company"
                
            
        }
    ]
   
    
});
module.exports=mongoose.model("Category", categorySchema);