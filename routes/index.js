var express = require('express');
var router = express.Router();

//
const multer = require('multer')

//Connect MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://adminDB:passwordDB@cluster0.fpgti75.mongodb.net/test').then((error) => {
  if (error != null) {
    console.log("Successful connection!!!")
  } else {
    console.log("Connection failed due to: " + error)
  }
});
const Wallpa = new mongoose.Schema({
  id: String,
  title: String,
  describe: String,
  days: String,
  link: String,
})

const  Wall = mongoose.model('wallpaper',Wallpa);

const arr =[];
Wall.find(function (error, result){
  if (result!=null){
    //console.log(result)
    for (const i in result) {
      var _id = result[i]._id;
      var id = result[i].id;
      var title = result[i].title
      var describe = result[i].describe
      var day = result[i].days
      var link = result[i].link
      arr.push({_id,id,title,describe,day,link})
    }
    console.log(arr)
  }else{
    console.log("dell co du lieu")
  }
})

/* GET home page. -------*/
router.get('/',function(req, res, next) {
  var arr1 = [];

  Wall.find({}).limit(100).then(arr=>{
    arr1= arr;
    res.render('index', { title: 'Wallpaper 4k' ,arr1:arr,arr:arr.slice(0,3)});
  })

});

router.get('/page=:page', function(req, res, next) {
  var tab = 4;
  var page = req.params.page;
  var start = (page-1)*tab;
  var end = (page-1)*tab+tab;


  Wall.find({}).limit(100).then(arr=>{
    res.render('index', { title: 'Beautiful stock photo of V' ,arr1:arr,arr:arr.slice(start,end)});
    //res.send(data.slice(start,end))
  })


});

router.get('/insertFormImage', function (req, res, next) {
  res.render('insertFormImage', {title: 'Thêm thông tin ảnh'});
})

router.post('/edit', function (req, res, next) {

  res.render('edit', {title: 'Sửa ảnh', arr:arr });
})

/* ======POST======. */

//UPLOAD FILE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {

    cb(null, Math.random() + Date.now()+"_"+ file.originalname)
  }
})


const upload = multer({ storage: storage})

//ADD DATA
router.post('/SendPhoData',upload.single('img'),function (req,res,next) {
  res.send(req.file.length)

  var id = req.body.id;
  var title = req.body.title;
  var describe = req.body.describe;
  var days = req.body.days;
  var link = req.file.path;
  console.log(req.file.path)

  var wpp = new Wall({
    id:id,
    title:title,
    describe:describe,
    days:days,
    link:link
  })
  wpp.save().then(data=>{
    if (data!=null){
      console.log("Add data successfully!!")
    }else {
      console.log("Add failed data!!")
    }
  })


  //res.send("ok")
})

router.post('/delete',function (req,res,next) {
  //CALL DB
  var ID = req.body.ID;

  Wall.deleteOne({_id:ID}).then(data=>{
    if (data!=null){
      res.send("Delete photo successfully!!")
    }else{
      res.send("Delete photo failed!!")
    }
  })
})

//
router.post('/viewImg',function (req,res,next) {
  var _id = req.body.ID;
  var id = req.body.id;
  var title = req.body.title;
  var messeger = req.body.messeger;
  var day = req.body.day;
  var link = req.body.link;

  var arr = [{_id,id,title,day,messeger,link}]

  console.log(link)

  res.render('edit',{title: "edit image",arr:arr})

})

router.post('/editimg',upload.single('img'),function (req,res,next) {
  var _id = req.body._id;
  var id = req.body.id;
  var title = req.body.title;
  var messeger = req.body.messeger;
  var day = req.body.day;
  var link = req.file.path;


  Wall.updateOne({_id:_id},{
    id:id,
    title:title,
    messeger :messeger,
    day:day,
    link:link
  }).then(data=>{
    if (data!=null){
      res.send("Update successful!!")
    }else{
      res.send("Update failed!!")
    }
  })


})

router.get('/api',function (req,res){
  Wall.find({}).then(data=>{
    res.json(data)
  })
})

module.exports = router;