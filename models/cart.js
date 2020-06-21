module.exports=function Cart(oldCart){
    this.items=oldCart.items || {};
    this.totalQty=oldCart.totalQty || 0;
    this.totalPrice=oldCart.totalPrice || 0;

    this.add=function(item,id,qtty){
        var storedItem=this.items[id];
        if(!storedItem){
            storedItem=this.items[id]={item:item,qty:0,qtty:0,price:0};
    
        }
        storedItem.qty++;
        storedItem.qtty+=qtty;
        storedItem.price=storedItem.item.price*storedItem.qtty;
        this.totalQty++;
        this.totalPrice+=storedItem.item.price*qtty;
        
    };
   

    this.reduceByOne = function (id,qtty) {
      
        this.items[id].qtty-=qtty;
        this.items[id].price -= this.items[id].item.price*qtty;
        this.totalPrice -= this.items[id].item.price*qtty;


        if(this.items[id].qtty <= 0) {
            delete this.items[id];
            this.totalQty--;
        }
    };

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    this.generateArray=function(){
        var arr=[];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
}