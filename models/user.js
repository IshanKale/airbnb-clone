const mongoose = require('mongoose');
const schema= mongoose.Schema({
  firstName:{ type:String,required:true},
  lastName:{ type:String},
  email:{ type:String,required:true,unique:true},
  password:{ type:String,required:true},
  usertype:{ type:String,required:true,enum:['guest','host']},
  favorites:[{type:mongoose.Schema.Types.ObjectId, ref:'Home'}]
})

module.exports = mongoose.model("User", schema)