const express=require("express");
const host =express.Router();
const { getaddhome,postaddhome } = require("../controllers/home");
const {find}=require("../models/home");
const home = require("../models/home");
const hostcontroller=require("../controllers/hostcontroller")

host.get("/host/add-home",getaddhome)
host.use(express.urlencoded())
host.post("/host/add-home",postaddhome)
host.get('/host/edit-home/:id', hostcontroller.edithome);
host.post('/host/edit-home', hostcontroller.postedithome);
host.get('/host/host-home-list', hostcontroller.hostHomeList);
host.post('/host/delete-home/:id', hostcontroller.postdeletehome);

module.exports={
  host
}