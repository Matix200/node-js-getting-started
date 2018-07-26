const PORT = process.env.PORT || 5000

var express = require("express");
var app     = express();
var path    = require("path");

app.use('/public', express.static(path.join(__dirname, '/public')));
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/main',function(req,res){
  res.sendFile(path.join(__dirname+'/public/main.html'));
});

app.get('/calendar',function(req,res){
  res.sendFile(path.join(__dirname+'/public/calendar.html'));
});

app.get('/news',function(req,res){
  res.sendFile(path.join(__dirname+'/public/news.html'));
});

app.get('/signals',function(req,res){
  res.sendFile(path.join(__dirname+'/public/signals.html'));
});

app.get('/cryptocurrency',function(req,res){
  res.sendFile(path.join(__dirname+'/public/cryptocurrency.html'));
});

app.get('/crypto',function(req,res){
  res.sendFile(path.join(__dirname+'/public/crypto.html'));
});

app.get('/groups',function(req,res){
  res.sendFile(path.join(__dirname+'/public/groups.html'));
});

app.get('/admingroup',function(req,res){
  res.sendFile(path.join(__dirname+'/public/admngroup.html'));
});

app.get('/editprofil',function(req,res){
  res.sendFile(path.join(__dirname+'/public/editprofil.html'));
});


app.listen(PORT);

console.log("Running at Port 3000");
