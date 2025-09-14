const mongo_url="URL FOR THE MongoDB"
const express=require("express")
const multer = require('multer');
const app=express()
const cookieParser = require('cookie-parser');
const userRoute=require("./routes/userRoute")
const {host} = require("./routes/hostRoute")
const { errorpage } = require("./controllers/home")
const path = require('path');
const mongoose = require('mongoose')
const authRouter = require("./routes/authRoute")
const session = require('express-session');
const mongodbstore=require("connect-mongodb-session")(session)



const randomString =(length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


const filefilter = (req, file, cb) => {
  if(['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {  
    cb(null, randomString(10) + '-' + file.originalname); // Unique filename
  }   
});

const multeroptions = {
  storage: storage,
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(multer(multeroptions).single('photourl')); // Middleware to handle file uploads

const store = new mongodbstore({
  uri: mongo_url,
  collection: 'sessions' // Collection name for storing sessions
});
app.use(session({
    // Secret key used to sign the session ID cookie and encrypt session data
    secret: 'IshanKale',
    // Forces session to be saved back to the session store, even if not modified
    resave: false,
    // Forces a session that is "uninitialized" to be saved to the store
    saveUninitialized: true,
    store: store // Use the MongoDB store for session management
  })
)
app.use(cookieParser());
app.use((req, res, next) => {
  // Use cookie-parser to easily access cookies
  req.isLoggedIn = req.session.isLoggedIn || false; 
  req.user=req.session.user || null;
  next();
});
app.use(userRoute)
app.use("/host",(req,res,next)=>{
  if(req.isLoggedIn){
    return next()
  }else{
    res.redirect("/login")
  }
})
app.use(host)
app.use(authRouter)
app.use(errorpage)

const port=3001
// mongoconnect(()=>{
//   app.listen(port,()=>{
//     console.log(`server is listening at http://localhost:${port}`)
//   })
// })



mongoose.connect(mongo_url).then(()=>{
  app.listen(port,()=>{
    console.log(`server is listening at http://localhost:${port}`)
  })
}).catch(err=>{
  console.log('error connectiong mongo',err)
})