const mongodb = require("mongodb")
const mongoose=require('mongoose');
/**
 *     this.houseName = houseName
    this.price = price
    this.location = location
    this.rating = rating
    this.photourl = photourl
    if(_id)this._id=_id
    this.description=description
 * 
    save()

 * 
    find()
 * 
    static deletebyid(id)

    static findById(homeId)
 */
const homeschema=mongoose.Schema({
  houseName:{type:String,required:true}
  ,price:{type:String,required:true}
  ,location:{type:String,required:true}
  ,rating:{type:String,required:true}
  ,photourl:{type:String}
  ,description:{type:String}
})


homeschema.pre('findOneAndDelete', async function(next) {
  const homeId = this.getQuery()._id;
  await fav.deleteMany({ homeid: homeId });
  console.log(`Deleted all favorites for home with ID: ${homeId}`);
  next();
});


module.exports=mongoose.model('Home',homeschema)