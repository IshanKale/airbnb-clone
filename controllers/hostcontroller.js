
const Home = require("../models/home")
const user = require("../models/user")

exports.edithome=(req,res,next)=>{
  const homeID=req.params.id
  console.log(homeID)
  const edit=(req.query.editing==='true')
  Home.findById(homeID).then((myhome)=>{
    if(!myhome){
      res.redirect("/host/host-home-list")
    }else{
      res.render("host/add-home",{
        pagetitle:"edit your home",
        editing:edit,
        home:myhome,
        activePage: 'add-home',
        isLoggedin:req.isLoggedIn,
        user:req.user
      })
    }
  })
}

exports.postedithome=(req,res,next)=>{
  const {id,houseName,price,location,rating,photourl,description}=req.body
  Home.findById(id).then((home)=>{
    home.houseName=houseName,
    home.price = price
    home.location = location
    home.rating = rating
    home.photourl = photourl
    home.description=description
    home.save().then(()=>{
      console.log('home edited succefully')
      res.redirect("host-home-list")
    }).catch((err)=>{
      console.log(err)
    })
  }).catch((err)=>{
    console.log(err)
  })
}

exports.postdeletehome=(req,res,next)=>{
  const homeid=req.params.id;
  console.log(homeid)
  Home.findByIdAndDelete(homeid).then((err) => {
    res.redirect("/host/host-home-list");
  });
}

exports.hostHomeList = (req, res) => {
  Home.find().then((allHomes)=>{
    res.render('host/host-home-list', { title: "Your homes", registeredHome: allHomes, activePage: 'host-home-list', isLoggedin:req.isLoggedIn ,user:req.user });
  });
};