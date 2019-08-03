// Options
const CLIENT_ID = '797556594343-l2igriejamuufh90dt8bh4pp2ihobn84.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('enter-button');
const signoutButton = document.getElementById('exit-button');
const content = document.getElementById('content');

// default youtube channel
// **************** NOT USED ****************
//************************************************
//const defaultChannel = 'googledevelopers'; 

// Load auth2 library
function handleClientLoad(){
	gapi.load('client:auth2', initClient);
}


// Init API client library and set up sing in listeners
function initClient(){
	gapi.client.init({
		discoveryDocs: DISCOVERY_DOCS,
		clientId: CLIENT_ID,
		scope: SCOPES
	}).then(() => {
		// Listen for sing state changes
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		// Handle initial sign in state
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignouClick;
	});
}

// update UI sign in state changes
function updateSigninStatus(isSignedIn){
	if(isSignedIn){
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		content.style.display = 'block';
//		getChannel(defaultChannel);
	}else{
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
		content.style.display = 'none';
	}
}

// Handle Login
function handleAuthClick(){
	gapi.auth2.getAuthInstance().signIn();
}

// Handle Logout
function handleSignouClick(){
	gapi.auth2.getAuthInstance().signOut();
}


//====================================================================================
//                              Start here the search into YT
//====================================================================================
function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

var scriptTime = new Array();
//var scriptTimeHMS = new Array();
var scriptText = new Array();
// scriptText = [" bla bla you bla bla test", " tou  bla you bla bla test1"," bla bla bla bla you"," hphv bla bla you bla test3"," bla bla bla bla test4"," ybla bla bla you test5","bou"," you   bla bla bla bla test13"," you test11"," you test10","bou"," ho oho you test", " you test1","  bla bla bla bla test2"," you test3"," you test4"," you test5","bou"," you test13"," you  bla bla bla bla  test11","h ehgl  you test10","bou"];
//scriptTime = ["00:08:02", "00:02:13","00:03:01","00:14:01","00:15:01","00:17:01","00:20:01","00:14:01","00:16:01","00:22:01","00:21:01","00:08:02", "00:02:13","00:33:01","00:34:01","00:35:01","00:37:01","00:30:01","00:34:01","00:36:01","00:32:01","00:31:01"];

var parser, xmlDoc;
var HTML_captions = "";

var ytApiKey = "AIzaSyCCf-S5kFXdDTWXc8cmCqBLXtjpt_5T18M";
var YTTitle;

var video_id = "";
var VideoID;
var player;
var searchGlobal;

//=========================  Angular =============================================
//================================================================================
var myApp = angular.module('YouTubeApp', []);

myApp.controller('YouTubeCtrl', function($scope) {
  //initial settings
  $scope.yt = {
    width: 600, 
    height: 480, 
    videoid: ""
  };
    
  $scope.sendControlEvent = function (ctrlEvent) {
    this.$broadcast(ctrlEvent);
  }
});

myApp.directive('youtube', function($window) {
  return {
    restrict: "E",

    scope: {
      height: "@",
      width: "@",
      videoid: "@"
    },

    template: '<div></div>',

    link: function(scope, element, attrs, $rootScope) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
//      var player;

      $window.onYouTubeIframeAPIReady = function() {

        player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 0,
            html5: 1,
            theme: "light",
            modesbranding: 0,
            color: "white",
            iv_load_policy: 3,
            showinfo: 1,
            controls: 1
          },
          
          videoId: scope.videoid, 
        });
      };

      scope.$watch('videoid', function(newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }
        change(scope.videoid);
        player.cueVideoById(VideoID);
      }); 
    }  
  };
});


//=========================  Angular =============================================
//================================================================================
//var app = angular.module('YouTubeApp', []);
//app.controller('myCtrl', function($scope) {
//    $scope.$watch('VideoID', function(newValue, oldValue) {
//  if (newValue == oldValue) {
//    return;
//  }
////  Call Change function
//    change();
////  player.cueVideoById(scope.videoid);
//    
//});
//});
//================================================================================
//================================================================================


function change (search){
    
//======================================
//    Clean the seach result first
//======================================
    table = document.getElementById("tbl");
    rows = table.getElementsByTagName("tr");
    Nbrows = rows.length;

    if(table && Nbrows != 0 ){
                    $("#tbl").find("tr").remove();
    }
//======================================
//======================================
    
//    search = document.getElementById("search").value;
    Length = search.length;
    video_id = search.indexOf("v=");
    ampersandPosition = search.indexOf("&");
    var dataAuto,dataMan ;

    if(ampersandPosition != -1) {
      video_id = search.substring(video_id+2, ampersandPosition);
      VideoID = video_id;
      run();

    }else{
      video_id = search.substring(video_id+2, Length);
      VideoID = video_id;
      run();

    }
};
                   
function run () { 

//  ******  For manual caption ******
   RequestMan =  "https://video.google.com/timedtext?v=";
   RequestMan = RequestMan.concat(video_id);
   Lang = "&id=0&lang=en";
   RequestMan = RequestMan.concat(Lang); 
//    *******************************

//  *******  For automatic caption ******
   RequestAuto =  "https://www.youtube.com/api/timedtext?v=";
   RequestAuto = RequestAuto.concat(video_id);
   Lang = "&lang=en&name=CC%20(English)";
   RequestAuto = RequestAuto.concat(Lang); 
//    ***********************************
    
 $.when(
     $.get(RequestMan, function(data) {
        dataMan = data;
      }),

      $.get(RequestAuto, function(data) {
            dataAuto = data;
      }),
    
 ).then(function(){
    if (dataMan){
          console.log("****** Data manual *******");
          console.log(dataMan);
//        onYouTubeIframe()
          getCaption(dataMan);
    }else{
          console.log("======= Data Auto =======");
          console.log(dataAuto);
//        onYouTubeIframe()
          getCaption(dataAuto);
    }
 });
    
YTTitle = " Title..";
// Parse the AJAX response and get the captions.
function getCaption(ajax_response) {
  try { 
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(ajax_response, "text/xml");
    //console.log(ajax_response);
    //console.log(xmlDoc.getElementsByTagName("transcript").length);
//    script = xmlDoc.getElementsByTagName("transcript")[0].childNodes;
    if (xmlDoc.getElementsByTagName("transcript").length > 0) {
      // Loop the results of the xmlDoc:
      for (var i = 0; i < xmlDoc.getElementsByTagName("transcript")[0].childNodes.length; i++) {
//        console.log(xmlDoc.getElementsByTagName("transcript")[0].childNodes[i].innerHTML);
        scriptText[i] = xmlDoc.getElementsByTagName("transcript")[0].childNodes[i].innerHTML;
//        console.log(xmlDoc.getElementsByTagName("transcript")[0].childNodes[i].attributes[0].nodeValue);
        scriptTime[i] = xmlDoc.getElementsByTagName("transcript")[0].childNodes[i].attributes[0].nodeValue;
        scriptTime[i] = time_convert(scriptTime[i]);
//        console.log(scriptTime[i]);
        HTML_captions += xmlDoc.getElementsByTagName("transcript")[0].childNodes[i].innerHTML + "<br/>";
      }
    } else {
      // Loop the results of the ajax_response;
      for (var i = 0; i < ajax_response.getElementsByTagName("transcript")[0].childNodes.length; i++) {
//        console.log(ajax_response.getElementsByTagName("transcript")[0].childNodes[i].innerHTML);
        scriptText[i]= ajax_response.getElementsByTagName("transcript")[0].childNodes[i].innerHTML; 
//          Temps = ajax_response.getElementsByTagName("transcript")[0].childNodes[i].attributes[0].nodeValue;
//        console.log(ajax_response.getElementsByTagName("transcript")[0].childNodes[i].attributes[0].nodeValue);
        scriptTime[i]= ajax_response.getElementsByTagName("transcript")[0].childNodes[i].attributes[0].textContent;
//        ********   nodeValue replaced by textContent ********
        scriptTime[i] = time_convert(scriptTime[i]);
//        console.log(scriptTime[i]);
        HTML_captions += ajax_response.getElementsByTagName("transcript")[0].childNodes[i].innerHTML + "<br/>";
      }
    }


setTimeout(fillData(), 2000);
  } catch (err) {
    console.log(err);
    alert('Error at getCaption function - see console form more details.');
  }
}

//$("#results").html("");
//    $.get("tpl/item.html", function(data) {
//        $("#results").append(tplawesome(data, [{"title":YTTitle, "videoid":video_id}]));
//    });
    
    
//    $.ajax({
//        url: '/tpl/item.html',
//        type: 'GET',
//        success: function(data){
//        $("#results").append(tplawesome(data, [{"title":YTTitle, "videoid":video_id}]));
//        }
//    });
    
resetVideoHeight();

function resetVideoHeight() {
    $(".video").css("height", $("#results").width() * 9/16);
}
    
//    Convert numbers into time format
function time_convert(num)
  { 
  var hours = Math.floor(num / 3600);  
  var val = num % 3600;
  var minutes = Math.floor(val / 60);
  var sec = val % 60;
  sec = sec.toFixed(0);
      
    if (hours.toString().length == 1){
        hours ="0" + hours;
    }
   if (minutes.toString().length == 1){
        minutes ="0" + minutes;
    }
   if (sec.toString().length == 1){
        sec ="0" + sec;
    }
      
      return hours + ":" + minutes + ":" + sec;   
}
    
// Fill the data "captions" in a HTML "div" control.
function fillData() {
  try {
  } catch (err) {
    console.log(err);
    alert('Error at fillData function - see console form more details.');
  }

}
} // function run

function runSearch () {
    search = document.getElementById("searchInYT").value;
    searchGlobal = search;
    indexOF = new Array(); 
    
//    Remove the old search result
    table = document.getElementById("tbl");
    rows = table.getElementsByTagName("tr");
    Nbrows = rows.length;

    if(table && Nbrows != 0 ){
                    $("#tbl").find("tr").remove();
    }

    scriptText.forEach(myFunction);
    
    function myFunction (item, index) {
       indexOF[index] = item.includes(search); 
    };
    SearchResult = 0;
    indexOF.forEach(display);
    
    function display (item, index){
        tbl = document.getElementById('tbl');
        if(item){
        addRow(tbl, scriptTime[index], scriptText[index]);
            SearchResult++;
        }
    };
  
    if(SearchResult == 0){
        alert("No corresponding result found! ");
    }

} //function runSearch


//********************
//Display the search result
//********************

  function addCell(tr, val) {
    var td = document.createElement('td');

    td.innerHTML = val;
    tr.appendChild(td)
      
    result = val.includes(":");
      if(result){
          td.classList.add("ClasseTime");
      }
      else{
          td.classList.add("ClasseText");
          td.innerHTML = val.replace(searchGlobal,'<span style="font-weight: bold;">'+searchGlobal+'<\/span>');
      }
  }

    
  function addRow(tbl, val_1, val_2) {
    var tr = document.createElement('tr');
    addCell(tr, val_1);
    addCell(tr, val_2);
    tbl.appendChild(tr)
  }


$(document).click(function(event) {
    var text = $(event.target).text();
    Dotes = text.includes(":");
    if(event.target.localName =="td" && Dotes)
    {
//        h= text.substr(0, 2);
//        h = h.concat("h");
//
//        m= text.substr(3, 2);
//        m = m.concat("m");
//
//        s= text.substr(6, 2);
//        s = s.concat("s");
        
//        Time = "";
//        Time = Time.concat("#t=");
//        Time = Time.concat(h);
//        Time = Time.concat(m);
//        Time = Time.concat(s);
//        alert("Voici le temps cliqué :"+Time);
//        link = document.getElementById('VidID').src;
//        link = link.concat(Time);
//        link = link.replace("embed","&output=embed");
//        document.getElementById('VidID').src = link;
        timetbl = text.split(':');
        newTime = (parseInt(timetbl[0]) * 3600) + (parseInt(timetbl[1]) * 60) + parseInt(timetbl[2]);
        player.seekTo(newTime);

    }
});


//https://www.youtube.com/watch?v=BPeFy4iyzn0

//===================================================================================
//for the new YT control player
//===================================================================================

//function onYouTubeIframeAPIReady() {
//function onYouTubeIframe (){
//    player = new YT.Player('video-placeholder', {
//        width: 600,
//        height: 400,
//        videoId: video_id,
//        playerVars: {
//            color: 'white',
//            playlist: 'taJ60kskkns,FG0fTKAqZ5g'
//        },
////        events: {
////            onReady: initialize
////        }
//    });
//}
