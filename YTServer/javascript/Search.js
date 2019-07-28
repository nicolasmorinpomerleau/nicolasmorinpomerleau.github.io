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

// Display channel Data
// **************** NOT USED ****************
//************************************************
//function showChannelData(data){
//	const channelData = document.getElementById('channel-data');
//	channelData.innerHTML = data;
//}

// Get channel from API
// **************** NOT USED ****************
//************************************************
//function getChannel(channel){
//	gapi.client.youtube.channels
//	.list({
//		part: 'snippet,contentDetails,statistics',
//		forUsername: channel
//	})
//	.then(response => {
//		console.log(response);
//		const channel = response.result.items[0];
//		
//		const output = `
//			<ul class="collection">
//				<li class="collection-item">Title: ${channel.snippet.title}</li>
//				<li class="collection-item">ID: ${channel.id}</li>
//				<li class="collection-item">Subscribers: ${channel.statistics.subscriberCount}</li>
//				<li class="collection-item">Views: ${channel.statistics.viewCount}</li>
//				<li class="collection-item">Videos: ${channel.statistics.videoCount}</li>
//			</ul>
//			<p>${channel.snippet.description}</p>
//			<hr />
//			<a class="btn red darken-2" target="_blnak" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
//		`;
//		showChannelData(output);
//	})
//	.catch(err => alert('No Channel By THat Name'));
//}


//====================================================================================
//                              Start here the search into YT
//====================================================================================
function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

var scriptTime = new Array(); 
var scriptText = new Array();
 scriptText = [" you test", " you test1"," you test2"," you test3"," you test4"," you test5","bou"];
scriptTime = ["00:08:02", "00:02:13","00:03:01","00:14:01","00:15:01","00:17:01","00:16:01"];

var parser, xmlDoc;
var HTML_captions = "";

var ytApiKey = "AIzaSyCCf-S5kFXdDTWXc8cmCqBLXtjpt_5T18M";
var YTTitle;

function run () { 
search = document.getElementById("search").value;
Length = search.length;
video_id = search.indexOf("v=");
//EndPos =  Length - (video_id +1);
ampersandPosition = search.indexOf("&");
var dataAuto,dataMan ;
//var scriptTime = new Array(); 
    
//var video_id = window.location.search.split('v=')[1];
//var ampersandPosition = video_id.indexOf('&');
if(ampersandPosition != -1) {
  video_id = search.substring(video_id+2, ampersandPosition);
}else{
  video_id = search.substring(video_id+2, Length);
}
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
    
//    alert(RequestMan);
//        $.ajax({
//        url: RequestMan,
//        type: 'GET',
//        success: function(data){
//                  getCaption(data);
//        }
//    });
    
//    To Do
//    choose the tmft format, and master it
//    convert from the format choosed into Hours, minutes ans seconds
    
//Hint:
//For automatic caption:
//    Liens que ça fonctionne pour automatique:
//    https://www.youtube.com/watch?v=D7ZL45xS39I&list=PLOU2XLYxmsIKW-llcbcFdpR9RjCfYHZaV&index=2
//https://www.youtube.com/api/timedtext?v=ziGZj_jZ72E&lang=en&name=CC%20(English)
//https://www.youtube.com/api/timedtext?v=ziGZj_jZ72E&caps=asr&key=yttt1&lang=en&name=CC%20(English)&fmt=srv3
// good example to start at the time wanted: https://www.youtube.com/watch?v=PjDw3azfZWI#t=31m08s
//For manual caption
//https://video.google.com/timedtext?v=zenMEj0cAC4&id=0&lang=en

//    Ted Talk Sugar
//    https://www.youtube.com/watch?v=BPeFy4iyzn0
   
    
//    $.get(RequestMan, function(data) {
//        dataMan = data;
//                  getCaption(dataMan);
//      });
    
    
 $.when(
     $.get(RequestMan, function(data) {
        dataMan = data;
      }),

      $.get(RequestAuto, function(data) {
            dataAuto = data;
      }),

//        $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + video_id + "&key=" + ytApiKey, function(data) {
//          YTTitle = data.items[0].snippet.title;
//        })
    
 ).then(function(){
    if (dataMan){
          console.log("****** Data manual *******");
          console.log(dataMan);
          getCaption(dataMan);
    }else{
          console.log("======= Data Auto =======");
          console.log(dataAuto);
          getCaption(dataAuto);
    }
 });
//   
    
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

$("#results").html("");
    $.get("tpl/item.html", function(data) {
        $("#results").append(tplawesome(data, [{"title":YTTitle, "videoid":video_id}]));
    });
    
    
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
      
//      to do
//        ad zero to a signle digit 
//        correct the calculation of s
        
  var hours = Math.floor(num / 3600);  
  var val = num % 3600;
  var minutes = Math.floor(val / 60);
  var sec = val % 60;
    if (hours.length == 1){
        hours ="0" + h;
    }
   if (minutes.length == 1){
        minutes ="0" + minutes;
    }
   if (sec.length == 1){
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
    indexOF = new Array(); 
//    index = $.inArray(search, scriptText);
//    searchText = new Array();
    
//    Remove the old search result
    table = document.getElementById("tbl");
    rows = table.getElementsByTagName("tr");
    Nbrows = rows.length;
//    rows = $('tbl').length;
//    table.deleteRow(i)
    if(table && Nbrows != 0 ){
//        $("#tbl").each(function(){
//                        $(this).parents('tr').remove();
//            for(i=Nbrows-1; i < 0; i--){
//                table.deleteRow(i)
//            }
                    $("#tbl").find("tr").remove();

//                });
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
//    else{
//        alert(SearchResult + " :result found.");
//    }
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
          td.classList.add("cursor");
      }
  }

//for start time
//#t=31m08s
//to do
//    vider les deux tableaux pour une nouvelle recherche
    
  function addRow(tbl, val_1, val_2) {
    var tr = document.createElement('tr');
    addCell(tr, val_1);
    addCell(tr, val_2);
    tbl.appendChild(tr)
  }

//function addCusor(val){
//    val.setAttribute("class", "cursor");
//}

$(document).click(function(event) {
    var text = $(event.target).text();
    Dotes = text.includes(":");
    if(event.target.localName =="td" && Dotes)
    {
//        IndexOfHours = text.indexOf(":");
//        if(IndexOfHours == 1){
//            h = text.substr(0, IndexOfHours);
//            h = "0" + h;
//            h = h.concat("h");
//        }
//        else{
//            h = text.substr(0, IndexOfHours);
//            h = h.concat("h");
//        }
//
//        
//        IndexOfminutes = text.lastIndexOf(":");
//        if(IndexOfminutes == 4 || IndexOfminutes == 3){
//            IndexOfminutes = IndexOfminutes -1;
//            m = text.substr(IndexOfminutes, 1);
//            m = "0" + m;
//            m = m.concat("m");
//        }
//        else{
//            m = text.substr(3, 2);
//            m = m.concat("m");        
//        }
        
        h= text.substr(0, 2);
        h = h.concat("h");

        m= text.substr(3, 2);
        m = m.concat("m");

        s= text.substr(6, 2);
        s = s.concat("s");
        
        Time = "";
        Time = Time.concat("#t=");
        Time = Time.concat(h);
        Time = Time.concat(m);
        Time = Time.concat(s);
        alert("Voici le temps cliqué :"+Time);
        
        link = document.getElementById('VidID').src;
        link = link.concat(Time);
        document.getElementById('VidID').src = link;
    }

//    alert("Voici le temps cliqué :"+Time);
});

//   jQuery("#tbl").keyup(function(){
//
//     for(i=0;i<searchbarresultarray.length;i++){
//               htmloutput= htmloutput+"<tr onclick="window.location='#';"><td class='searchbarresult' id='"+i+"'>"result"</td></tr>";
//                }
//        jQuery("#tbl").html(htmloutput);
//
//    });
//
//    jQuery(document).on('mouseover','.tbl',function(){
//        jQuery(this).css( "background-color", "black" ); 
//     });


//https://www.youtube.com/watch?v=BPeFy4iyzn0
