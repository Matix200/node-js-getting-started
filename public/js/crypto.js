

      var HOST = "wss://crypto-socket-binance.herokuapp.com/";
      var ws = new WebSocket(HOST);
      var el = document.getElementById('server-time');
      ws.onmessage = function (event) {
		AllBinanceData = event.data;
      };
	  
	   var HOST2 = "wss://crypto-socket-bittrex.herokuapp.com/";
      var wss = new WebSocket(HOST2);
      var el = document.getElementById('server-time');
      wss.onmessage = function (event) {
		AllBittrexData = event.data;
      };		


Parse.liveQueryServerURL = 'wss://tradehub-livequery-server.herokuapp.com';

function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

function getBinanceByCode(code) {
var json = JSON.parse(AllBinanceData);
  return json.filter(
    function(json) {
      return json.Market == code 
    }
  );
}

function getBittrexByCode(code) {
var json = JSON.parse(AllBittrexData);
  return json.filter(
    function(json) {
      return json.Market == code 
    }
  );
}

	  function getPercentageChange(oldNumber, newNumber){
    var decreaseValue = newNumber - oldNumber;
    // return Math.floor((decreaseValue/oldNumber)*100)
    return 100 * decreaseValue / oldNumber;
    // return Math.floor((decreaseValue/oldNumber)*100)
}

var AllCoinAlert = [];
function getMyNotifications() {
var rekordyN = '';
AllCoinAlert = [];
MyCoinsNotifications = [];
var currentUser = Parse.User.current();
var user = Parse.User.current();
var relations = user.relation("Notifications");
	var query = relations.query();
	query.include("CryptoCurrency");
	query.find().then(function(results){
	 for (var i in results){
	   var id = results[i].id;
	   var Coin = results[i].get("CoinName");
       var Symbol = results[i].get("Symbol");
	   var Market = results[i].get("Market");
	   var exchange = results[i].get("Exchange");
	   var Pointer = results[i].get("CryptoCurrency");
	   var IMG = Pointer.get("IMGfile");
	   var BelowPrice = results[i].get("BelowPrice");
	   var AbovePrice = results[i].get("AbovePrice");
	   var Kind = results[i].get("KindNotifications");
	   var FavoriteCoin = exchange+'-'+Symbol+'-'+Market;
	   var FavoriteCoinAlert = exchange+'-'+Symbol+'-'+Market+'-'+BelowPrice+'-'+AbovePrice+'-'+id+'-'+Coin;
     AllCoinAlert.push({
        "Exchange": exchange,
        "Symbol": Symbol,
        "Market"      : Market,
        "BelowPrice"     : BelowPrice,
        "AbovePrice" : AbovePrice,
        "ID" : id,
        "CoinName" : Coin,
        "KindNotifications" : Kind
      })

	   if(MyCoinsAlert.indexOf(FavoriteCoin) > -1){}else{
		MyCoinsAlert.push(FavoriteCoinAlert);
	   }

	}

	$(document).ready(function(){
setInterval(GetAlerts, 2500);
	});

});
}

function getMyNotificationsContent() {
var rekordyN = '';
var currentUser = Parse.User.current();
var user = Parse.User.current();
var relations = user.relation("NotificationsContent");
	var query = relations.query();
	query.find().then(function(results){
     for (var i in results){
	   var id = results[i].id;
       var ContentClass = results[i].get("ContentClass");
	   var ContentID = results[i].get("ContentID");
	   var Kind = results[i].get("KindNotifications");
	   var Cases = results[i].get("Cases");
       var Delete = results[i].get("Delete");
       var UserP = results[i].get("UserP");
       var ChanelP = results[i].get("ChanelP");
       
         SubscribeNotificationsContent(ContentClass, ContentID, Kind, Cases, Delete, UserP, ChanelP);

     }
});  
}                        
  $(document).ready(function(){    
        ion.sound({
            sounds: [
                {name: "definite"},                
            ],
            path: "sounds/",
            preload: false,
            volume: 1.0
        });
    
});





var AllChatOpen = [];
var AllFriends = [];
function GetMyFriends(){
var rekordyFriends = '';
AllFriends = [];
var UserId = Parse.User.current().id;
var currentUser = Parse.User.current();
var date = new Date(); 
currentUser.set("LastTime", date);
currentUser.save().then(function(){
var user = Parse.User.current();
var relations = user.relation("MyFriends");
var queryMF = relations.query();
queryMF.equalTo("accepted", true)
queryMF.include("FirstUser");
queryMF.include("SecondUser");
queryMF.find().then(function(results){
     for (var i in results){
      if(results[i].get("ID1") != UserId) {
      var ID =  results[i].id; 
      var IDuser =  results[i].get("ID1");
      var Pointer =  results[i].get("FirstUser");
      var NickName =  Pointer.get("NickName");
      var LastTime =  Pointer.get("LastTime");
      if(Pointer.get("IMGfile")){ var curl = Pointer.get("IMGfile").url();}else{var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}
      AllFriends.push({
        "IDrelation": ID,
        "NickName": NickName,
        "IDuser"      : IDuser,
        "IMG"     : curl,
        "LastTime" : LastTime
      })}
      if(results[i].get("ID2") != UserId ) {
        var ID =  results[i].id; 
      var IDuser2 =  results[i].get("ID2");
      var Pointer2 =  results[i].get("SecondUser");
      var NickName2 =  Pointer2.get("NickName");
      var LastTime2 =  Pointer2.get("LastTime");
      if(Pointer2.get("IMGfile")){ var curl2 = Pointer2.get("IMGfile").url();}else{var curl2 = "https://serwer1708065.home.pl/demo_img/user-1.png";}
      AllFriends.push({
        "IDrelation": ID,
        "NickName": NickName2,
        "IDuser"      : IDuser2,
        "IMG"     : curl2,
        "LastTime" : LastTime2

      })}
     }

for(var i in AllFriends) {
var Time = (AllFriends[i].LastTime - date) / 1000;
console.log(Time);
if(Time < (-70)){var status = "offline"}else{
 var status = "online" 
}
rekordyFriends +='<li id="OpenChat" IMG="'+AllFriends[i].IMG+'" IDrelation="'+AllFriends[i].IDrelation+'"  usrnick="'+AllFriends[i].NickName+'" usrid="'+AllFriends[i].IDuser+'"class="contact"><div class="wrap">';
rekordyFriends +='<span id="'+AllFriends[i].IDrelation+'" class="contact-status '+status+'"></span>';
rekordyFriends +='<img src="'+AllFriends[i].IMG+'" alt="" />';
rekordyFriends +='<div class="meta"><p class="name">'+AllFriends[i].NickName+'</p>';
rekordyFriends +='</div></div></li>';
}

     $("#MyAllFriends").html(rekordyFriends);
     setInterval(function(){
 GetLastTime();
}, 60000);
});
});  
}

function GetLastTime(){
var UserId = Parse.User.current().id;

var currentUser = Parse.User.current();
var date = new Date(); 
currentUser.set("LastTime", date);
currentUser.save().then(function(){

var user = Parse.User.current();
var relations = user.relation("MyFriends");
var queryMF = relations.query();
queryMF.equalTo("accepted", true)
queryMF.include("FirstUser");
queryMF.include("SecondUser");
queryMF.find().then(function(results){
     for (var i in results){
      if(results[i].get("ID1") != UserId) {
      var ID =  results[i].id; 
      var Pointer =  results[i].get("FirstUser");
      var LastTime =  Pointer.get("LastTime");

      var Time = (LastTime - date) / 1000;

      if(Time < (-70)){
      $("#"+ID).attr("class", "contact-status offline");
     }else{
      $("#"+ID).attr("class", "contact-status online");
      }}
      if(results[i].get("ID2") != UserId ) {
      var ID =  results[i].id;  
      var Pointer2 =  results[i].get("SecondUser");
      var LastTime2 =  Pointer2.get("LastTime");

      var Time2 = (LastTime2 - date) / 1000;

      if(Time2 < (-70)){
      $("#"+ID).attr("class", "contact-status offline");
     }else{
      $("#"+ID).attr("class", "contact-status online");
      }



      }
      }  
});
});
}






$(document).on('click', '#OpenChat', function(){
var userid = $(this).attr("usrid");
var usernick = $(this).attr("usrnick");
var IMG = $(this).attr("IMG");
var IDrelation = $(this).attr("IDrelation");
if(AllChatOpen.indexOf(IDrelation) > -1){}else{  
OpenChat(userid, IMG, usernick, IDrelation);
}
});


function OpenChat(userid, IMG, usernick, IDrelation){
if(AllChatOpen.length >= 4) CloseLastChat();
var rekordyChat = '';
rekordyChat += '<div style= IDrelation="'+IDrelation+'" class="uChat'+IDrelation+'" id="dolnyczat"><div class="content">';
rekordyChat += '<div IDrelation="'+IDrelation+'" userid="'+userid+'" hide="false" class="contact-profile"><p>'+usernick+'</p>';
rekordyChat += '<div IDrelation="'+IDrelation+'" id="closeChat" class="social-media"><i class="fa fa-times"  aria-hidden="true"></i></div>';
rekordyChat += '</div><div id="AllMessageBox'+userid+'" class="messages"><ul id="ChatM'+userid+'">'; 
rekordyChat += '</ul></div>';
rekordyChat += '<div id="message'+IDrelation+'" class="message-input"><div class="wrap">';
rekordyChat += '<input userid="'+userid+'" IDrelation="'+IDrelation+'" class="sendEnter" id="inputChat'+IDrelation+'" type="text" placeholder="Write your message..." />';
rekordyChat += '<button class="submit"><i class="fa fa-paperclip" aria-hidden="true"></i></button>';
rekordyChat += '<button userid="'+userid+'" IDrelation="'+IDrelation+'" id="sendMessage" class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>';
rekordyChat += '</div></div></div></div>'


$("#AllUserChats").append(rekordyChat);
ChatValueOpen(IDrelation);
GetContentChat(userid, IDrelation, IMG); 
}


$(document).on('click', '.contact-profile', function(){
let IDrelation = $(this).attr("IDrelation");
var hide = $(this).attr("hide");
if(hide === "false"){
$(".uChat"+IDrelation).attr("style", "height: 40px;");
$("#message"+IDrelation).attr("style", "display: none;");
$(this).attr("hide", "true");}
else if(hide === "true"){
$(".uChat"+IDrelation).attr("style", "height: 360px;");
$("#message"+IDrelation).attr("style", "display: block;");
$(this).attr("hide", "false");}
});



$(document).on('click', '#settings-hide', function(){
$( "#sidepanel" ).attr("style", "width: 55px;");
$( "#sidepanel" ).attr("id", "sidepanel-small");
$( "#AllUserChats" ).attr("style", "right: 60px;");

$( "#profile").attr("id", "profile-small");
  $(this).attr("id", "settings-show");
  $("#arrow").attr("class", "fa fa-arrow-circle-o-left");
  });

$(document).on('click', '#settings-show', function(){
$( "#sidepanel-small" ).attr("style", "width: 240px;");
$( "#sidepanel-small" ).attr("id", "sidepanel");
$( "#profile-small").attr("id", "profile");
$( "#AllUserChats" ).attr("style", "right: 245px;");
$(this).attr("id", "settings-hide");
$("#arrow").attr("class", "fa fa-arrow-circle-o-right");
  });




function GetContentChat(user, ID, userIMG) {
var x = 0;
var MYid = Parse.User.current().id;
var cUser = Parse.User.current();


if(cUser.get("IMGfile")){ 
var curl = cUser.get("IMGfile").url();}else{
var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}
var rekordyContent = '';

var Message = Parse.Object.extend("Message");
var MessageQuery = new Parse.Query(Message);
MessageQuery.equalTo("relationID", ID)
MessageQuery.descending("createdAt");
MessageQuery.limit(20);
MessageQuery.find().then(function(results){
for(var i in results){
var idMessage = results[i].id;
var id1 = results[i].get("ID1");
var id2 = results[i].get("ID2");
var content = results[i].get("content");



if(id1 === MYid) {
rekordyContent = '';
rekordyContent += '<li  class="replies"><img src="'+curl+'" alt="" />';
rekordyContent += '<p>'+content+'</p></li>';

}
if(id1 === user) {
    var Read = results[i].get("Read");
  userID = user;
 if(Read == false){
var idLastUnread = idMessage;
x++;
}   
rekordyContent = '';
rekordyContent += '<li read="'+Read+'" id="'+idMessage+'" class="sent"><img src="'+userIMG+'" alt="" />';
rekordyContent += '<p>'+content+'</p></li>';
}

$("#ChatM"+user).prepend(rekordyContent); 
}
if(!x == 0 ){
$("#ChatM"+user).append('<li><button id="ShowUnRead" userid="'+userID+'" rID="'+ID+'" idLastMessage="'+idLastUnread+'">Show '+x+' unRead message</button></li>');
} 
$("#ChatM"+user).prepend('<li><button>load more</button></li>'); 


console.log(AllFriends);
 $("#AllMessageBox"+user).animate({ scrollTop: $("#AllMessageBox"+user).prop("scrollHeight")}, 500);  
});
}


$(document).on('click', '#ShowUnRead', function(){
let IDLast = $(this).attr("idLastMessage");
let rID = $(this).attr("rID");
let user = $(this).attr("userid");
$(this).attr("style", "display:none");

    $("#AllMessageBox"+user).animate({
        scrollTop: $( "#"+IDLast ).offset().top
    }, 500);
    
    SetAllToRead(rID, user);
});

function SetAllToRead(ID, USER){
var Message = Parse.Object.extend("Message");
var MessageQuery = new Parse.Query(Message);
MessageQuery.equalTo("relationID", ID);
MessageQuery.equalTo("ID1", USER);
MessageQuery.equalTo("Read", false)
MessageQuery.descending("createdAt");
MessageQuery.limit(20);
MessageQuery.find().then(function(results){
for(var i in results){
  results[i].set("Read", true);
  results[i].save(); 
} 


});
}


function ChatValueOpen( value ) {
AllChatOpen.push(value);
}

function ChatValueClose( value ) {
var index = AllChatOpen.indexOf(value);
if (index > -1) {
  AllChatOpen.splice(index, 1);
  $(".uChat"+value).remove();
}  
}

function CloseLastChat() {
var count = AllChatOpen.length;
var id = AllChatOpen[count];
var index = AllChatOpen.indexOf(id);
if (index > -1) {
  AllChatOpen.splice(index, 1);
  $(".uChat"+id).remove();
} 
}


function SubscribeMyMessage(){ 
var cUserid = Parse.User.current().id;
var queryMessage = new Parse.Query("Message");
queryMessage.equalTo("ID2", cUserid);
queryMessage.equalTo("Read", false);
queryMessage.include("Friends");
subscriptionMessage = queryMessage.subscribe();
    
    
subscriptionMessage.on('open', () => {
 console.log('subscription opened');
});





subscriptionMessage.on('create', (object) => {
var pointer = object.get("Friends");
var IDrelation = pointer.id;
console.log(IDrelation);
var Chat = CheckIsChatOpened(IDrelation);

if(Chat){
var rekordyContent = '';
var cUser = Parse.User.current(); 
 if(cUser.get("IMGfile")){ 
var curl = cUser.get("IMGfile").url();}else{
var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";} 
var id1 = object.get("ID1");
var id2 = object.get("ID2");
var content = object.get("content");
var userinfo = getFriendsInfo(id1);
rekordyContent = '';
rekordyContent += '<li class="sent"><img src="'+userinfo[0].IMG+'" alt="" />';
rekordyContent += '<p>'+content+'</p></li>';
$( document ).ready(function() {
$("#ChatM"+id1).append(rekordyContent);

 $("#AllMessageBox"+id1).animate({ scrollTop: $("#AllMessageBox"+id1).prop("scrollHeight")}, 500);   
});   
}else if(Chat == false){
var id1 = object.get("ID1");
var userinfo = getFriendsInfo(id1);  
OpenChat(id1, userinfo[0].IMG, userinfo[0].NickName, IDrelation);
}
}); 

subscriptionMessage.on('delete', (object) => {


});                    
}

    function getFriendsInfo(code) {
var json = JSON.parse(JSON.stringify(AllFriends));
  return json.filter(
    function(json) {
      return json.IDuser == code 
    }
  );
}

    function CheckIsChatOpened(value) {
if(AllChatOpen.indexOf(value) > -1){
  return true; 
}else{
    return false;
  }
}



$(document).on('click', '#closeChat', function(){
let IDrelation = $(this).attr("IDrelation");
ChatValueClose(IDrelation);
});



$(document).on('click', '#sendMessage', function(){
var ID = $(this).attr("IDrelation");
let content = $("#inputChat"+ID).val();
let userid = $(this).attr("userid"); 
SendMessage(ID, content, userid);
}); 

function SendMessage(ID, content, userid){
 var cUser = Parse.User.current();
if(cUser.get("IMGfile")){ 
var curl = cUser.get("IMGfile").url();}else{
var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}
var rekordyContent = ''; 
let MYid = Parse.User.current().id;
var Friends = Parse.Object.extend("Friends");  
var Message = Parse.Object.extend("Message"); 
var postACL = new Parse.ACL(); 
postACL.setWriteAccess(userid, true);
postACL.setReadAccess(userid, true);
postACL.setWriteAccess(MYid, true);
postACL.setReadAccess(MYid, true);      
Message = new Message();
Message.set("ID1", MYid);
Message.set("ID2", userid);
Message.set("content", content);
Message.set("Read", false);
Message.set("relationID", ID);
Message.set("Friends", Friends.createWithoutData(ID));
Message.setACL(postACL);
Message.save().then(function(obj) {
rekordyContent = '';
rekordyContent += '<li class="replies"><img src="'+curl+'" alt="" />';
rekordyContent += '<p>'+content+'</p></li>';
$( document ).ready(function() {
$("#ChatM"+userid).append(rekordyContent); 
});
 $("#AllMessageBox"+userid).animate({ scrollTop: $("#AllMessageBox"+userid).prop("scrollHeight")}, 1000);  
$("#inputChat"+ID).val(""); 
});
}



  $(document).on('keyup', '.sendEnter', function(ev){
    if(ev.keyCode == 13){
var ID = $(this).attr("IDrelation");
let content = $("#inputChat"+ID).val();
let userid = $(this).attr("userid"); 
SendMessage(ID, content, userid);
    }
});





function FindFriend(name){
var rekordyFind = '';
var query = new Parse.Query(Parse.User);
query.contains('NickName', name);
query.limit(5);
query.find()
  .then(function(results) {
    if(results.length > 0) {
   for(var i in results){
    var NickName = results[i].get("NickName");
    var id = results[i].id;
    var Check = getFriendsInfo(id);
    if(Check.length > 0){
    rekordyFind += '<span>'+NickName+' added</span>';
    }else{
    rekordyFind += '<span>'+NickName+' <i class="fa fa-plus-circle" id="SetInvate" Fid="'+id+'" aria-hidden="true"></i></span>';
    }
    }
    $(".searched").html(rekordyFind);
  }else{
    $(".searched").html("Not found");
  }
  })
  .catch(function(error) {
    // There was an error.
  });
}


$(function(){

    $('#filtrcontact').keyup(function(){
        
        var searchText = $(this).val();
        
        $('#MyAllFriends > li').each(function(){
            
            var currentLiText = $(this).text(),
                showCurrentLi = currentLiText.indexOf(searchText) !== -1;
            
            $(this).toggle(showCurrentLi);
            
        });     
    });

});

$(document).on('click', '#SetInvate', function(){
let id =  $(this).attr("Fid");
$(this).attr("class", "fa fa-check-circle-o");
let MyId = Parse.User.current().id;
let postACL = new Parse.ACL(); 
postACL.setWriteAccess(MyId, true);
postACL.setReadAccess(MyId, true);
postACL.setWriteAccess(id, true);
postACL.setReadAccess(id, true);
var Users = Parse.Object.extend(Parse.User);
var Friends = Parse.Object.extend("Friends");
var Friends = new Friends();
Friends.set("ID1", MyId);
Friends.set("ID2", id);
Friends.set("accepted", false);
Friends.set("FirstUser", Users.createWithoutData(MyId));
Friends.set("SecondUser", Users.createWithoutData(id));
Friends.setACL(postACL);
Friends.save().then(function(obj) {
var user = Parse.User.current();
var relation = user.relation("MyFriends");
relation.add(obj);
user.save().then(function(obj2) {
$( "#inputFriends" ).val("");
$( "#AddFriend" ).dialog( "close" );  
}); }); 
});


function GetFriendsInvate() {
var cUser = Parse.User.current().id;
let queryFriends = new Parse.Query("Friends");
queryFriends.equalTo("ID2", cUser);
queryFriends.equalTo("accepted", false);
queryFriends.include("FirstUser");
queryFriends.include("SecondUser");
queryFriends.descending("createdAt");
queryFriends.find().then(function(friends){
$("#FriendsInvateCount").text(friends.length);
    var rekordyFriends = '';
   for(let i in friends)  {
var FirstUser = friends[i].get("FirstUser");
var Inviting = friends[i].get("ID1");
var NickName = FirstUser.get("NickName");
if(FirstUser.get("IMGfile")){ var curl = FirstUser.get("IMGfile").url();}else{var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}

rekordyFriends += '<li><div class="friend-requests-info">';
rekordyFriends += '<div class="thumb"><a href="#"><img src="'+curl+'" alt=""></a></div>';
rekordyFriends += '<a href="#" class="name">'+NickName+' </a><span>Invate you : <button id="AddtoFriends" userinviting="'+Inviting+'">Add Friends</button></span></div></li>';


}
$("#FriendsInvate").html(rekordyFriends);
    });
}


$(document).on('click', '#AddtoFriends', function(){
var MyId = Parse.User.current().id;
var invitingID =  $(this).attr("userinviting")
let queryFriends = new Parse.Query("Friends");
var postACL = new Parse.ACL(); 
queryFriends.equalTo("ID1", invitingID );
queryFriends.first().then(function(object){
object.set("accepted", true);
object.save().then(function(obj) {
var user = Parse.User.current();
var relation = user.relation("MyFriends");
relation.add(obj);
user.save().then(function(obj2) {
GetFriendsInvate(); 
GetMyFriends();
}); }); });
});


function GetSubscribeFriends(){

var cUser = Parse.User.current().id;
let queryFriends = new Parse.Query("Friends");
queryFriends.equalTo("ID2", cUser);
queryFriends.include("FirstUser");
queryFriends.include("SecondUser");
queryFriends.descending("createdAt");
let subscriptionInvate = queryFriends.subscribe();
    
    
subscriptionInvate.on('open', () => {
 console.log('subscription opened');
});


subscriptionInvate.on('create', (object) => {
var count = $("#FriendsInvateCount").text();
$("#FriendsInvateCount").text(parseInt(count) + 1);
var rekordyInvate = '';    
var FirstUser = object.get("FirstUser");
var Inviting = object.get("ID1");
var NickName = FirstUser.get("NickName");
if(FirstUser.get("IMGfile")){ var curl = FirstUser.get("IMGfile").url();}else{var curl = "https://serwer1708065.home.pl/demo_img/user-1.png";}

rekordyInvate += '<li><div class="friend-requests-info">';
rekordyInvate += '<div class="thumb"><a href="#"><img src="'+curl+'" alt=""></a></div>';
rekordyInvate += '<a href="#" class="name">'+NickName+' </a><span>Invate you : <button id="AddtoFriends" userinviting="'+Inviting+'">Add Friends</button></span></div></li>';

 $("#FriendsInvate").prepend(rekordyInvate);

}); 

subscriptionInvate.on('update', (object) => {                  
});
}



function GetSubscribeAcceptedFriends(){
var cUser = Parse.User.current().id;
let queryFriends = new Parse.Query("Friends");
queryFriends.equalTo("ID1", cUser);
queryFriends.include("FirstUser");
queryFriends.include("SecondUser");
let subscriptionAccepted = queryFriends.subscribe();
    
    
subscriptionAccepted.on('open', () => {
 console.log('subscription opened');
});

subscriptionAccepted.on('update', (object) => {
GetMyFriends();
console.log("updated");

});
}


function GetAlerts(){
console.log(AllCoinAlert);
for(var i in AllCoinAlert){

if(AllCoinAlert[i].Exchange == "Binance"){
var Pair = AllCoinAlert[i].Symbol+AllCoinAlert[i].Market;
var foundF = getBinanceByCode(Pair);
if(typeof foundF[0].Last == "undefined") {var Price = "0.00000000"}else {var Price = foundF[0].Last;}
var below = AllCoinAlert[i].BelowPrice;
var Above = AllCoinAlert[i].AbovePrice;
var id = AllCoinAlert[i].ID;
var coin = AllCoinAlert[i].CoinName;
var Kind = AllCoinAlert[i].KindNotifications;
console.log(Kind);
if(parseFloat(Price) > parseFloat(Above)) { 
alertPrice(Price, id); 
AddToPush(AllCoinAlert[i].Symbol, AllCoinAlert[i].Market, AllCoinAlert[i].Exchange, Price, coin);
delete AllCoinAlert[i];
if(Kind.indexOf("Alert") > -1){
  $(document).ready(function(){
ion.sound.play("definite");
    });
}
}
if(parseFloat(Price) < parseFloat(below)) { 
alertPrice(Price, id); 
AddToPush(AllCoinAlert[i].Symbol, AllCoinAlert[i].Market, AllCoinAlert[i].Exchange, Price, coin);
delete AllCoinAlert[i];
if(Kind.indexOf("Alert") > -1){
  $(document).ready(function(){
ion.sound.play("definite");
    });
}
}

}
if(AllCoinAlert[i].Exchange == "Bittrex"){
var Pair = CoinsVal[1]+CoinsVal[2];
var foundF = getBittrexByCode(Pair);
if(typeof foundF[0].Last == "undefined") {var Price = "0.00000000"}else {var Price = foundF[0].Last;}
var below = AllCoinAlert[i].BelowPrice;
var Above = AllCoinAlert[i].AbovePrice;
var id = AllCoinAlert[i].ID;
var coin = AllCoinAlert[i].CoinName;
var Kind = AllCoinAlert[i].KindNotifications;
console.log(Kind);
if(parseFloat(Price) > parseFloat(Above)) { 
alertPrice(Price, id); 
AddToPush(AllCoinAlert[i].Symbol, AllCoinAlert[i].Market, AllCoinAlert[i].Exchange, Price, coin);
delete AllCoinAlert[i];
if(Kind.indexOf("Alert") > -1){
  $(document).ready(function(){
ion.sound.play("definite");
    });
}
}
if(parseFloat(Price) < parseFloat(below)) { 
alertPrice(Price, id); 
AddToPush(AllCoinAlert[i].Symbol, AllCoinAlert[i].Market, AllCoinAlert[i].Exchange, Price, coin);
delete AllCoinAlert[i];
if(Kind.indexOf("Alert") > -1){
  $(document).ready(function(){
ion.sound.play("definite");
    });
}
}
}

}

}

function alertPrice(price, id) {
var priceA = parseFloat(price);
var date = new Date();
var user = Parse.User.current();
var relations = user.relation("Notifications");
	var query = relations.query();
	query.equalTo("objectId", id);
	query.first().then(function(object){
	object.destroy();
});
}

function AddToPush(Symbol, Market, Exchange, price, CoinName){
var user = Parse.User.current();
var userid = Parse.User.current().id;
var date = new Date();
var PushNotifications = Parse.Object.extend("PushNotifications");
var PushNotifications = new PushNotifications();
PushNotifications.set("Kind", "CoinAlert");
PushNotifications.set("Symbol", Symbol);
PushNotifications.set("Coin", CoinName);
PushNotifications.set("Market", Market);
PushNotifications.set("Exchange", Exchange);
PushNotifications.set("Date", date);
PushNotifications.set("User", user);
PushNotifications.set("UserId", userid);
PushNotifications.set("Read", false);
PushNotifications.set("Price", price);
PushNotifications.save().then(function(obj) {
var userN = Parse.User.current();
var relation = userN.relation("PNotifications");
relation.add(obj);
userN.save().then(function(obj2) {
getMyNotifications();
});
});
}
    
    function GetAllPushNotifications(){
var rekordyPush = '';
var currentUser = Parse.User.current();
var userID = Parse.User.current().id;
var PushNotifications = new Parse.Query("PushNotifications");
	PushNotifications.descending("createdAt");
  PushNotifications.equalTo("Read", false);
    PushNotifications.equalTo("UserId", userID);
	PushNotifications.count().then(function(count) {
	console.log(count);
        $('#NotificationsCount').text(count);
    var query2 = new Parse.Query("PushNotifications");
        query2.equalTo("UserId", userID);
        query2.descending("createdAt");
        query2.limit(20);
        query2.find().then(function(results){
		 for (var i in results){
    var Kind = results[i].get("Kind");
	if(Kind == "CoinAlert"){
    var id = results[i].id;    
	var Symbol = results[i].get("Symbol");
	var Market = results[i].get("Market");
	var Exchange = results[i].get("Exchange");
	var Price = results[i].get("Price");
    var Read = results[i].get("Read");
	var date = results[i].get("createdAt");
        date = date.toISOString();
    var Datesplit = date.split("T");
    var Time = Datesplit[1].split(":");
    var Title = Symbol+"/"+Market+":  "+Exchange;
    if(Read){var read = '<li id="'+id+'">'}else{ var read = '<li id="'+id+'" class="NotificationRead" style="background: #f1f1f1">'}    
rekordyPush += ''+read+'<div class="notification-info"><a ><i class="fa fa-bell color-1"></i>';
rekordyPush += '<strong>'+Title+'</strong> Price:  <span>'+Price+'<i id="removeNotification" idNote="'+id+'" class="fa fa-times removeX"></i></span>';
rekordyPush += '<h5 class="time">'+Datesplit[0]+'  '+Time[0]+':'+Time[1]+'</h5></a></div></li>';
}
    if(Kind == "ContentNote"){
    var id = results[i].id;    
	var ChanelName = results[i].get("ChanelName");
	var NickName = results[i].get("NickName");
    var GroupName = results[i].get("GroupName");          
    var Read = results[i].get("Read");
	var date = results[i].get("createdAt");
        date = date.toISOString();
    var Datesplit = date.split("T");
    var Time = Datesplit[1].split(":");
    var Title = GroupName+'/'+ChanelName;
    if(Read){var read = '<li id="'+id+'">'}else{ var read = '<li id="'+id+'" class="NotificationRead" style="background: #f1f1f1">'}    
rekordyPush += ''+read+'<div class="notification-info"><a ><i class="fa fa-bell color-1"></i>';
rekordyPush += '<strong>'+Title+'</strong> Post aded:  <span>'+NickName +'<i id="removeNotification" idNote="'+id+'" class="fa fa-times removeX"></i></span>';
rekordyPush += '<h5 class="time">'+Datesplit[0]+'  '+Time[0]+':'+Time[1]+'</h5></a></div></li>';
}
}
$("#NotificationsPush").html(rekordyPush);
            GetSubscribePushNotifications();
});});
}
    
    
    function GetSubscribePushNotifications(){
var user = Parse.User.current();
var currentUser = Parse.User.current().id;
var  queryF = new Parse.Query("PushNotifications");
queryF.equalTo("UserId", currentUser);
let subscription = queryF.subscribe();

        
subscription.on('open', () => {
 console.log('subscription opened');

});

subscription.on('create', (object) => {
    var count = $('#NotificationsCount').text();
    var newCount = parseInt(count)+1;
    var rekordyPush = '';
    var Kind = object.get("Kind");
    if(object.get("KindAlert")){
      var arrayKind = object.get("KindAlert");
      if(arrayKind.indexOf("Alert") > -1){
          $(document).ready(function(){
                ion.sound.play("definite");
                                       });
      }
    }
	if(Kind == "CoinAlert"){
    var id = object.id;    
	var Symbol = object.get("Symbol");
	var Market = object.get("Market");
	var Exchange = object.get("Exchange");
	var Price = object.get("Price");
    var Read = object.get("Read");
	var date = object.get("createdAt");
        date = date.toISOString();
    var Datesplit = date.split("T");
    var Time = Datesplit[1].split(":");
    var Title = Symbol+"/"+Market+":  "+Exchange;
    if(Read){var read = '<li id="'+id+'">'}else{ var read = '<li id="'+id+'" class="NotificationRead" style="background: #f1f1f1">'}    
rekordyPush += ''+read+'<div class="notification-info"><a><i class="fa fa-bell color-1"></i>';
rekordyPush += '<strong>'+Title+'</strong> Price:  <span>'+Price+'<i id="removeNotification" idNote="'+id+'" class="fa fa-times removeX"></i></span>';
rekordyPush += '<h5 class="time">'+Datesplit[0]+'  '+Time[0]+':'+Time[1]+'</h5></a></div></li>';
}
        if(Kind == "ContentNote"){
    var id = object.id;    
	var ChanelName = object.get("ChanelName");
	var NickName = object.get("NickName");
    var GroupName = object.get("GroupName");    
    var Read = object.get("Read");
	var date = object.get("createdAt");
        date = date.toISOString();
    var Datesplit = date.split("T");
    var Time = Datesplit[1].split(":");
    var Title = GroupName+'/'+ChanelName;
    if(Read){var read = '<li id="'+id+'">'}else{ var read = '<li id="'+id+'" class="NotificationRead" style="background: #f1f1f1">'}    
rekordyPush += ''+read+'<div class="notification-info"><a><i class="fa fa-bell color-1"></i>';
rekordyPush += '<strong>'+Title+'</strong> Post aded:  <span>'+NickName +'<i id="removeNotification" idNote="'+id+'" class="fa fa-times removeX"></i></span>';
rekordyPush += '<h5 class="time">'+Datesplit[0]+'  '+Time[0]+':'+Time[1]+'</h5></a></div></li>';
}
$('#NotificationsCount').text(newCount);
$("#NotificationsPush").prepend(rekordyPush);
});

subscription.on('delete', (object) => {

});                      
} 

    $(document).on('click', '#removeNotification', function(event){
      event.stopPropagation();
      var id = $(this).attr('idNote');
var  query = new Parse.Query("PushNotifications");
query.get(id, {
       success: function(yourObj) {

       yourObj.destroy({}).then(function() {

    $("#"+id).attr("style", "display: none");
    var count = $('#NotificationsCount').text();
    var newCount = parseInt(count)-1;
        $('#NotificationsCount').text(newCount);

  }, function(error) {
    console.log("coś poszło nie tak");
  }); 
 } 
    });  
 });


    
    $(document).on('click', '.NotificationRead', function(event){
      event.stopPropagation();
    var count = $('#NotificationsCount').text();
    var newCount = parseInt(count)-1;
        $('#NotificationsCount').text(newCount);
      var id = $(this).attr('id');
        $(this).removeAttr("style");
      var user = Parse.User.current();
      var relations = user.relation("PNotifications");
	  var query = relations.query();    
      query.equalTo("objectId", id);
      query.first().then(function(object){
          object.set('Read', true);
          object.save().then(function(save){
        
              }); 
          });    
     });  

 function getMyInvests() {
var currentUser = Parse.User.current();
var user = Parse.User.current();
var relations = user.relation("MyInvest");
	var query = relations.query();
	query.include("CryptoCurrency");
	query.find().then(function(results){
	 for (var i in results){
	   var id = results[i].id;
	   var Coin = results[i].get("CoinName");
       var Symbol = results[i].get("Symbol");
	   var Market = results[i].get("Market");
	   var PriceBuy = results[i].get("PriceBuy");
	   var exchange = results[i].get("Exchange");
	   var IMG = results[i].get("IMGfile");
	   var Qty = results[i].get("Qty");
	   
	  
	   var FavoriteCoin = exchange+'-'+Symbol+'-'+Market+'-'+Qty+'-'+PriceBuy;
	   if(MyCoinsInvest.indexOf(FavoriteCoin) > -1){}else{
	   	MyCoinsInvest.push(FavoriteCoin);
	   }

	}

	$(document).ready(function(){
setInterval(getValuesInvest, 2500);
	});

});
}



function SearchChanel(inputsearch){
var rekordySerched = '';
var query = new Parse.Query("ForumChanel");
query.fullText('Content', inputsearch);
query.select('Content', 'User');
query.descending('createdAt');
query.include("User");
query.limit(5);
query.find()
  .then(function(results) {
    if(results.length > 0) {
   for(var i in results){
    var content = results[i].get("Content");
    var Pointer = results[i].get("User");
    var NickName = Pointer.get("NickName")
    rekordySerched += '<li>  '+NickName+': '+content+'<li>';

    
}
  }else{
  $("#AllSearched").html("<li>No results</li>");
  $("#AllSearched").attr("style", "display: block");     
}
if(rekordySerched.length > 0){  
$("#AllSearched").html(rekordySerched);
$("#AllSearched").attr("style", "display: block");
}else{
$("#AllSearched").html("<li>No results</li>");
$("#AllSearched").attr("style", "display: block");   
}
})
  
  .catch(function(error) {
   console.log(error);
  });
    
} 


function getValuesInvest(){
var AllDollarBinance = [];
var AllDollarBittrex = [];
if(typeof AllBinanceData !== "undefined"){
for(var i in MyCoinsInvest){
var CoinsVal = MyCoinsInvest[i].split("-");  
if(CoinsVal[0] == "Binance"){
var Pair = CoinsVal[1]+CoinsVal[2];
var foundF = getBinanceByCode(Pair);
if(typeof foundF[0].Last == "undefined") {var Price = "0.00000000"}else {var Price = foundF[0].Last;}
if(typeof foundF[0].Volumen == "undefined") {var Volumen = "0.00000000"}else {var Volumen = foundF[0].Volumen;}
if(typeof foundF[0].Prev == "undefined") {var Percent = "0.00000000"}else {var Percent = foundF[0].Prev;}
if(CoinsVal[2] == "USDT"){
if(Price > 1){ var PriceA = parseFloat(Price).toFixed(2);}
if(Price < 1){ var PriceA = parseFloat(Price).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var change = parseFloat(Percent).toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*PriceA).toFixed(2);
AllDollarBinance.push(MyValue);
}
if(CoinsVal[2] == "BTC"){
var getBTCPrice = getBinanceByCode("BTCUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var change = parseFloat(Percent).toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBinance.push(MyValue);
}
if(CoinsVal[2] == "ETH"){
var getBTCPrice = getBinanceByCode("ETHUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var change = parseFloat(Percent).toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBinance.push(MyValue);
}
if(CoinsVal[2] == "BNB"){
var getBTCPrice = getBinanceByCode("BNBUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var change = parseFloat(Percent).toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBinance.push(MyValue);
}
}
if(CoinsVal[0] == "Bittrex"){
var Pair = CoinsVal[2]+"-"+CoinsVal[1];
var foundx = getBittrexByCode(Pair);
var Price = foundx[0].Last;
var Volumen = foundx[0].Volumen;
var Percent = foundx[0].Prev;

if(CoinsVal[2] == "USDT"){
if(Price > 1){ var PriceA = parseFloat(Price).toFixed(2);}
if(Price < 1){ var PriceA = parseFloat(Price).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var percents = getPercentageChange(Percent, Price);
var change = percents.toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*PriceA).toFixed(2);
AllDollarBittrex.push(MyValue);
}
if(CoinsVal[2] == "BTC"){
var getBTCPrice = getBittrexByCode("USDT-BTC");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var percents = getPercentageChange(Percent, Price);
var USDp = (USDPrice*PriceA);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBittrex.push(MyValue);
}
if(CoinsVal[2] == "ETH"){
var getBTCPrice = getBittrexByCode("USDT-ETH");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var Vol = parseFloat(Volumen).toFixed(2);
var percents = getPercentageChange(Percent, Price);
var change = percents.toFixed(2);
var qty = CoinsVal[3];
var MyValue = (parseFloat(qty)*USDp).toFixed(2);
AllDollarBittrex.push(MyValue);
}
}

}
    console.log(AllDollarBinance);
var countAllBinance = 0;
var countAllBittrex = 0;

var getBTCBinance = getBittrexByCode("USDT-BTC");
var PriceBinance = getBTCBinance[0].Last;
var getBTCBittrex = getBinanceByCode("BTCUSDT");
var PriceBittrex = getBTCBittrex[0].Last;
for(var x in AllDollarBinance){
countAllBinance = countAllBinance+parseFloat(AllDollarBinance[x]);
}
for(var x in AllDollarBittrex){
countAllBittrex = countAllBittrex+parseFloat(AllDollarBittrex[x]);
}
var BTCValBinance = countAllBinance/parseFloat(PriceBinance);
var BTCValBittrex = countAllBittrex/parseFloat(PriceBittrex);
console.log(countAllBittrex, countAllBinance, BTCValBinance, BTCValBittrex);
AllBTC = (BTCValBinance+BTCValBittrex).toFixed(8);
AllDollar = (countAllBittrex+countAllBinance).toFixed(2);
$("#MyAllInvest").html('<i class="fa fa-btc"></i> '+AllBTC+' BTC / <i class="fa fa-dollar"></i>  '+numberWithSpaces(AllDollar)+' USD</a>');
}else{}
}

function getMyCurrency() {
var	rekordy = '';
	   rekordy  += '<li class="color-2">';
	   rekordy  += '<a href="crypto.html#bitcoin#BINANCE:BTCUSDT">';
	   rekordy  += '<img src="coins/bitcoin.png">';
	   rekordy  += '<div class="krypto">';
	   rekordy  += '<span class="AllCBinance-BTC-USDT"></span>';
	   rekordy  += '<b class="priceCBinance-BTC-USDT"><i class="fa fa-circle-o-notch fa-spin" style="font-size:10px"></i></b>';		
	   rekordy  += '</div></a></li>';
	   MyCoinsMenu.push("Binance-BTC-USDT");
var user = Parse.User.current();
var relations = user.relation("Favorite");
	var query = relations.query();
	query.include("CryptoCurrency");
	query.find().then(function(results){
	 for (var i in results){
	   var id = results[i].id;
	   var Coin = results[i].get("CoinName");
       var Symbol = results[i].get("Symbol");
	   var Exchange = results[i].get("exchange");
	   var Market = results[i].get("Market");
	   var IMG = results[i].get("IMGfile");
	   var FavoriteCoin = Exchange+'-'+Symbol+'-'+Market;
    if(MyCoinsMenu.indexOf(FavoriteCoin) > -1){}else{
	   MyCoinsMenu.push(FavoriteCoin);}

	   
	  
	   rekordy  += '<li class="color-2">';
	   rekordy += '<a href="crypto.html#'+IMG+'#'+Exchange.toUpperCase()+':'+Symbol+Market+'">';
	   rekordy += '<img src="coins/'+IMG+'.png">';
	   rekordy += '<div class="krypto">';
	   rekordy += '<span class="AllC'+FavoriteCoin+'"></span>';
	   rekordy += '<b class="priceC'+FavoriteCoin+'"><i class="fa fa-circle-o-notch fa-spin" style="font-size:10px"></i></b>';		
	   rekordy += '</div></a></li>';
	   

	}
	rekordy += '<li class="right"><i class="fa fa-list" id="showFriends" style="margin-top: 7px; font-size: 24px;"></i></li>';
	$( "#AllCryptoO" ).html( rekordy );

	setInterval(getMenuValue, 2000);
});
}




function getMenuValue(){
console.log(MyCoinsMenu);
if(typeof AllBinanceData !== "undefined"){
for(var i in MyCoinsMenu){
var CoinsVal = MyCoinsMenu[i].split("-");
if(CoinsVal[0] == "Binance"){
var Pair = CoinsVal[1]+CoinsVal[2];
var foundF = getBinanceByCode(Pair);
if(typeof foundF[0].Last == "undefined") {var Price = "0.00000000"}else {var Price = foundF[0].Last;}
if(typeof foundF[0].Volumen == "undefined") {var Volumen = "0.00000000"}else {var Volumen = foundF[0].Volumen;}
if(typeof foundF[0].Prev == "undefined") {var Percent = "0.00000000"}else {var Percent = foundF[0].Prev;}

if(CoinsVal[2] == "USDT"){
if(Price > 1){ var PriceA = parseFloat(Price).toFixed(2);}
if(Price < 1){ var PriceA = parseFloat(Price).toFixed(5);}
var change = parseFloat(Percent).toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-usd'></i> "+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA);    
}
if(CoinsVal[2] == "BTC"){
var getBTCPrice = getBinanceByCode("BTCUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var change = parseFloat(Percent).toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-btc'></i> "+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA); 
}
if(CoinsVal[2] == "ETH"){
var getBTCPrice = getBinanceByCode("ETHUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var change = parseFloat(Percent).toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-eth'></i> "+numberWithSpaces(PriceA));
}
if(CoinsVal[2] == "BNB"){
var getBTCPrice = getBinanceByCode("BNBUSDT");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var change = parseFloat(Percent).toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html(""+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA);     
}
}
if(CoinsVal[0] == "Bittrex"){
var Pair = CoinsVal[2]+"-"+CoinsVal[1];
var foundx = getBittrexByCode(Pair);
var Price = foundx[0].Last;
var Volumen = foundx[0].Volumen;
var Percent = foundx[0].Prev;
if(CoinsVal[2] == "USDT"){
if(Price > 1){ var PriceA = parseFloat(Price).toFixed(2);}
if(Price < 1){ var PriceA = parseFloat(Price).toFixed(5);}
var percents = getPercentageChange(Percent, Price);
var change = percents.toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-usd'></i> "+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA);     
}
if(CoinsVal[2] == "BTC"){
var getBTCPrice = getBittrexByCode("USDT-BTC");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var percents = getPercentageChange(Percent, Price);
var change = percents.toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-btc'></i> "+numberWithSpaces(PriceA));
}
if(CoinsVal[2] == "ETH"){
var getBTCPrice = getBittrexByCode("USDT-ETH");
var USDPrice = getBTCPrice[0].Last;
var PriceA = parseFloat(Price).toFixed(8);
var USDp = (USDPrice*PriceA);
if(USDp > 1){ var USDvalue = parseFloat(USDp).toFixed(2);}
if(USDp < 1){ var USDvalue = parseFloat(USDp).toFixed(5);}
var percents = getPercentageChange(Percent, Price);
var change = percents.toFixed(2);
if(change > 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: green;"> ('+change+'%)</i>';
if(change < 0 ) var Per = ''+CoinsVal[1]+'/'+CoinsVal[2]+'<i style="color: red;"> ('+change+'%)</i>'; 
$(".AllC"+MyCoinsMenu[i]).html(Per);
$(".priceC"+MyCoinsMenu[i]).html("<i class='fa fa-eth'></i> "+numberWithSpaces(PriceA));
$(".priceC"+MyCoinsMenu[i]).attr("value", PriceA);     
}
}

}							      
}else{
}
}


function getAllGroups() {
var rekordyG = '<li><a href="groups.html"><i class="fa fa-users"></i>Groups</a></li>'
var cUser = Parse.User.current();
  var GroupsPermission = Parse.Object.extend("GroupsPermission");
    var Query_Groups = new Parse.Query(GroupsPermission);
    Query_Groups.equalTo("UserPointer", cUser);
	Query_Groups.include("GroupPointer");
    Query_Groups.find({	
	success: function(results) {
	 for (var i in results){
 var DateEx = results[i].get("exDate");
 var UserKey = results[i].get("UserKey");
 var Pointer = results[i].get("GroupPointer");
 var GroupName = Pointer.get("GroupName");
 var ShortName = Pointer.get("short");
 var Premium = Pointer.get("Premium");
	 
  var endDate =   new Date(); 
  var nDays = diffDays(endDate, DateEx);
  if(Premium){
  rekordyG += '<li><a id="ShowGroup" kind="Premium" href="forum.html#'+UserKey+'"><h3>'+ShortName[0]+'<span>'+ShortName[1]+'</span></h3>'+GroupName+'  <small>('+nDays+' days)</small></a></li>';
	}else{
  rekordyG += '<li><a id="ShowGroup" kind="Free" href="forumfree.html#'+UserKey+'"><h3>'+ShortName[0]+'<span>'+ShortName[1]+'</span></h3>'+GroupName+'  <small>('+nDays+' days)</small></a></li>';
  }

	}
	$( "#AllGroups" ).html( rekordyG );

  },
  error: function(error) {
    console.log("Error: "+error.message);
  }
});
}

 $(document).on('click', '#ShowGroup', function(){
var href = $(this).attr("href");
window.location.reload(true);
});

function diffDays(d1, d2)
{
  var ndays;
  var tv1 = d1.valueOf();  // msec since 1970
  var tv2 = d2.valueOf();

  ndays = (tv2 - tv1) / 1000 / 86400;
  ndays = Math.round(ndays - 0.5);
  return ndays;
}

   $(document).on('click', '#showFriends', function(){
    document.getElementById("mySidenav").style.display = "block";
    $(this).attr("id", "closeFriends");
    });

    $(document).on('click', '#closeFriends', function(){
    document.getElementById("mySidenav").style.display = "none";
    $(this).attr("id", "showFriends");
    
    });

  function getTypes(){
var AllTypes = [];
var AllTypesJSON = [];
  var Bittrex = Parse.Object.extend("Bittrex");
  var Binance = Parse.Object.extend("Binance");
    var Query_Binance = new Parse.Query(Binance);
    Query_Binance.exists("Chart");
	Query_Binance.limit(250);
	Query_Binance.include("CryptoCurrency");
    Query_Binance.find().then(function(BinanceCoins){
	for(var i in BinanceCoins){
    var Coin = BinanceCoins[i].get("Chart");
	var CoinName = BinanceCoins[i].get("CoinName");
	var Pointer = BinanceCoins[i].get("CryptoCurrency");
	var IMG = Pointer.get("IDCMC");
	if(AllTypes.indexOf(Coin) > -1){}else{
	AllTypes.push(Coin);
	var Allinfo = Coin.split(":");
	AllTypesJSON.push({ALL: Coin+":"+CoinName, CoinNames: CoinName, Exchange: Allinfo[0], Pair: Allinfo[1],IMGfile: IMG});
	}}
	var Query_Bittrex = new Parse.Query(Bittrex);
	Query_Bittrex.exists("Chart");
	Query_Bittrex.limit(250);
	Query_Bittrex.include("CryptoCurrency");
    Query_Bittrex.find().then(function(BittrexCoins){
	for(var i in BittrexCoins){
    var Coin = BittrexCoins[i].get("Chart");
	var CoinName = BittrexCoins[i].get("CoinName");
	var Pointer = BittrexCoins[i].get("CryptoCurrency");
	var IMG = Pointer.get("IDCMC");
	if(AllTypes.indexOf(Coin) > -1){}else{
	AllTypes.push(Coin);
	var Allinfo = Coin.split(":");
	AllTypesJSON.push({ALL: Coin+":"+CoinName, CoinNames: CoinName, Exchange: Allinfo[0], Pair: Allinfo[1],IMGfile: IMG});
	}}

var options = {
	data: AllTypesJSON,
	list: {
		maxNumberOfElements: 12,
		match: {
			enabled: true
		},
        onClickEvent: function() {
			let coin  = $("#SearchCrypto").getSelectedItemData().IMGfile;
            let ALL  = $("#SearchCrypto").getSelectedItemData().ALL;
            var alltosplit = ALL.split(':');
            var link = "crypto.html#"+coin+"#"+alltosplit[0]+":"+alltosplit[1];
            location.href = link;
            

		}
        
	},
	getValue: "ALL",
	template: {
		type: "custom",
		method: function(value, item) {
			return "<img class='imgsearch' src='coins/all/32x32/"+item.IMGfile+".png'><b>" + item.CoinNames + "</b> | " + item.Pair + " | " + item.Exchange;
		}
	}
};
$("#SearchCrypto").easyAutocomplete(options); 
});
});
}


  
$( document ).ready(function() {
    $('#inputFriends').bind('input', function() { 
    var inputF = $(this).val();
    if(inputF.length >= 3){
    FindFriend(inputF);
    }else if(inputF.length == 0){
        $(".searched").html('');
    }else{
        $(".searched").html('<i class="fa fa-circle-o-notch fa-spin" style="font-size:10px"></i>');
    }
});
});
    