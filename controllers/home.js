const Home = require("../models/home")
const user = require("../models/user")





exports.getaddhome =(req,res,next)=>{
  res.render('host/add-home',{
    pagetitle:"add a new home",
    editing:false,
    activePage: 'add-home',
    isLoggedin:req.isLoggedIn,
    user:req.user
  })
}





exports.postaddhome =(req,res,next)=>{
  const {houseName,price,location,rating,photourl,description}=req.body;
  const home = new Home({houseName,price,location,rating,photourl,description})
  if(!req.file){
    return res.status(400).send("No file uploaded.");
  }
  console.log(req.file)
  home.save().then(()=>{
    console.log('home saved successfully')
    res.render('host/home-added', { activePage: 'add-home' ,isLoggedin:req.isLoggedIn,
    user:req.user});
  }).catch((err) => {
      console.log(err);
      res.status(500).send("Failed to save home.");
    });
}





exports.gethome=(req,res,next)=>{
  console.log(req.url,req.method)
  console.log("seccion info",req.session)
  Home.find().then((registeredHome)=>{
    res.render('store/home',{pageTitle : "air bnb",registeredHome, activePage: 'home',isLoggedin:req.isLoggedIn,
    user:req.user})
  })
}





exports.errorpage=(req,res,next)=>{
  res.status(404).render("404",{isLoggedin:req.isLoggedIn,
    user:req.user})
}





exports.gethomedetails=(req,res,next)=>{
  const homeId=req.params.homeId
  Home.findById(homeId).then((myhome)=>{
    if(!myhome){
      res.redirect("/")
    }
    else{
      console.log("home details found",myhome)
      res.render("store/home-detail",{
        Home:myhome,
        activePage: undefined,
        isLoggedin:req.isLoggedIn,
        user:req.user
      })
    }
  })
}






exports.addtofav=async (req,res,next)=>{
  console.log("add to favoutrite req came ",req.body)
  const id=req.body.homeId;
  const userRT=await user.findById(req.user._id);
  if(!userRT.favorites.includes(id)){
    console.log("home is not in favourites")
    await userRT.favorites.push(id);
    await userRT.save();
  }
  // const userId = req.user._id;
  // fav.findOne({homeid:id}).then((result)=>{
  //   if(result){
  //     console.log('home is already in favrourite')
      
  //   }else{
  //     const favourite=new fav({homeid:id});
  //     favourite.save().then(()=>{
  //       console.log('fav is saved')
  //     });
  //   }
    res.redirect('/favourite-list')
  // }).catch((err)=>{
  //   console.log(err)
  // })
}







exports.deleteFromFav = async (req, res) => {
  const id = req.params.id; // Match the route param name
  const userRT = await user.findById(req.user._id);
  if(userRT.favorites.includes(id)){
    console.log("home is in favourites, deleting it")
    userRT.favorites = userRT.favorites.filter(favId => favId.toString() != id)
    await userRT.save()
  }
  res.redirect('/favourite-list');
  // fav.findOneAndDelete({ homeid: id }).then((result) => {
  //   console.log(result);
  // }).catch(err => {
  //   console.log(err);
  // }).finally(() => {
  // });
};








exports.getfavouritehomes = async (req, res) => {
  const userId = req.user._id
  const userRT=await user.findById({ _id: userId }).populate('favorites')
  console.log("userRT", userRT.favorites)
  // fav.find().populate('homeid').then(favs => {
  //   // Only include the populated home objects
  //   const favourites = favs
  //     .map(fav => fav.homeid)
  //     .filter(home => home); // filter out any nulls (in case a home was deleted)
    res.render('store/favourite-list', {
      favourites: userRT.favorites,
      isLoggedin:req.isLoggedIn,
      user:req.user
  });
  // })
}