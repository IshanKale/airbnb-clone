const express=require("express")
const { gethome, gethomedetails,getfavouritehomes, delfav} = require("../controllers/home");
const user =express.Router()

user.get("/", (req, res) => {
  res.redirect("/home");
});
user.get("/home", gethome);
user.get("/add-home", (req, res) => {
  res.render("host/add-home",{pagetitle:"add a new home",editing:false,isLoggedin:req.isLoggedIn,user:req.user});
});
user.get('/home-detail', (req, res) => res.render('store/home-detail',{isLoggedin:req.isLoggedIn,user:req.user}));
user.get('/favourite-list', getfavouritehomes);
user.get('/reserve', (req, res) => res.render('store/reserve', { activePage: 'reserve' ,isLoggedin:req.isLoggedIn,user:req.user}));
user.get('/bookings', (req, res) => res.render('store/bookings', { activePage: 'bookings' ,isLoggedin:req.isLoggedIn,user:req.user}));
user.get("/details/:homeId",gethomedetails)
user.use(express.urlencoded())
user.post('/delete-fav/:id', require('../controllers/home').deleteFromFav);
user.post('/favorites', require('../controllers/home').addtofav);

module.exports=user