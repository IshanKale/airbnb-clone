const User = require('../models/user')
const Home = require('../models/home')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
  res.render('auth/login',{isLoggedin:req.isLoggedIn,errors:[],
    oldInput:[],user:{}})
}

exports.postLogin = async (req, res, next) => {
  console.log(req.body);
  const {email,password} = req.body;
  const user=await User.findOne({email:email})
  if(!user){
    return res.status(422).render('auth/login',{
      isLoggedin:false,
      errors:['invalid email or password'],
      oldInput:{email:email},
      user:{}
    })
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch){
    return res.status(422).render('auth/login',{
      isLoggedin:false,
      errors:['invalid email or password'],
      oldInput:{email:email},
      user:{}
    })
  }
  req.session.isLoggedIn=true
  req.session.user=user;
  await req.session.save()
  res.redirect('/');
}

exports.postLogout = (req, res, next) => {
  console.log("logout request came")
  req.session.destroy(()=>{
    res.redirect('/')
  });
}

exports.getsignup=(req,res)=>{
  console.log("signup request came")
  res.render('auth/signup',{
    isLoggedin :req.isLoggedIn,
    errors:[],
    oldInput:[],
      user:{}
  })
}

exports.postsignup=[
  check('firstName')
  .trim()
  .isLength({min:2})
  .withMessage('first name should be atleast of 2 charecter long')
  .matches(/^[A-Za-z\s]+$/)
  .withMessage('first name should only contain alphabets'),

  check('lastName')
  .trim()
  .isLength({min:2})
  .withMessage('last name should be atleast of 2 charecter long')
  .matches(/^[A-Za-z\s]+$/)
  .withMessage('last name should only contain alphabets'),

  check('email')
  .isEmail()
  .withMessage('please enter a valid email')  
  .normalizeEmail(),


  check('password')
  .isLength({min:8})
  .withMessage('password should be atleast of 8 charecter long')
  .matches(/[A-Z]/)
  .withMessage('password should contain atleast one uppercase letter')
  .matches(/[a-z]/) 
  .withMessage('password should contain atleast one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('password should contain atleast one number')
  .matches(/[@$!%*?&:_]/)
  .withMessage('password should contain atleast one special character'),

  check('confirmPassword')
  .custom((value,{req})=>{
    if(value!==req.body.password){
      throw new Error('passwords do not match')
    }
    else{
      return true
    }
  }),



  check('usertype')
  .notEmpty().withMessage('please select a user type')
  .custom((val) => {
    if (val !== 'guest' && val !== 'host') {
      throw new Error('please select a user type');
    }
    return true;
  }),




  check('terms')
  .notEmpty()
  .withMessage('please accept the terms and conditions')
  .custom((val, {req})=>{
    if(val!=='on'){
      throw new Error('please accept the terms and conditions')
    }
    else{
      return true
    }
  }),



  (req,res)=>{bcrypt.hash(req.body.password, 12).then(hashedPassword => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      usertype: req.body.usertype
    });
    return user.save();
  }).then(result => {
    console.log('User created successfully');
    res.redirect('/login');
  }).catch(err => {
    console.error('Error creating user:', err);
    res.status(500).render('auth/signup', {
      isLoggedin: req.isLoggedIn,
      errors: ['An error occurred while signing up. Please try again.'],
      oldInput: req.body,
      user:{}
    });
  })}
]
