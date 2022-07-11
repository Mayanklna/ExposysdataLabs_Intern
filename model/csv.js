var mongoose=require('mongoose');
var csvschema=new mongoose.Schema({
    csvdata:{
        type:[]
    }
});
module.exports=mongoose.model('emails',csvschema);
