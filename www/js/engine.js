
//====================================================================
// ================================== Virka ==========================
//====================================================================
var tentative = 0;
var nouveuMessage;

//function ListeDesMarchands(){
//$.ajax({
//  dataType: "json",
//  url: "https://s3-eu-west-1.amazonaws.com/virtualcard/marchand.json",
////  data: data,
//  success: function(data) {
//$('#Restauration').empty();
//            $('#Restauration').append(data[0].restauration);
//            
//            $('#Service').empty();
//            $('#Service').append(data[0].Service);
//                
//            $('#Mobilier').empty();
//            $('#Mobilier').append(data[0].Mobilier);
//                
//            $('#provinciaux').empty();
//            $('#provinciaux').append(data[0].provinciaux);
//
//             console.log(data[0]);  }
//});

//};

//============================================================
//    background-color: rgb(33, 129, 202); pour le logo virka
//    font-family: "Avenir W01", Arial, sans-serif;
//============================================================


function ListeDesMarchands(){
    
//    $.getJSON("https://s3-eu-west-1.amazonaws.com/virtualcard/restauration.json",function(data,status){

//    *************************************************************
//    ************************ Restauration ************************
//    *************************************************************
    if(localStorage.boolrestauration  == "false"){
        document.getElementById("restauration").style.display="none";
//        $('#restauration').style.display="none";
//         $('#restauration').listview('refresh');
        }
//$('#MyListView').listview().listview('refresh');
    else{
        $.getJSON("https://s3-eu-west-1.amazonaws.com/virtualcard/restauration.json",function(data,status){    
                $('#restaurationDIV').empty();
                $('#restaurationDIV').append(data[0].restauration);
                $('#restaurationDIV').listview('refresh'); /* to refresh the div */
        });
    };
//    *************************************************************

//    *************************************************************
//    ************************ Provinciaux ************************
//    *************************************************************
//                    à modifier pour les urls
    if(localStorage.boolprovinciaux  == "false"){
         document.getElementById("provinciaux").style.display="none";
//        $('#provinciaux').style.display="none";
//         $('#provinciaux').listview('refresh');
    }
    else{ 
        $.getJSON(localStorage.provinciaux,function(data,status){
                $('#provinciauxDIV').empty();
                $('#provinciauxDIV').append(data[0].provinciaux);
                $('#provinciauxDIV').listview('refresh');

        });
    };
//    *************************************************************

    
//    *************************************************************
//    ************************ Mobilier ************************
//    *************************************************************
    if(localStorage.boolmobilier  == "false"){
        document.getElementById("mobilier").style.display="none";
//        $('mobilier').style.display="none";
//         $('#mobilier').listview('refresh');
    }
    else{
        $.getJSON("/www/restauration.html",function(data,status){
                $('#mobilierDIV').empty();
            var element = document.getElementById('mobilierDIV');
            element.insertAdjacentHTML('afterbegin', '<div> google </div>');
               // $('#mobilierDIV').append("/www/restauration.html");
                $('#mobilierDIV').listview('refresh');

        });
    };
//    *************************************************************

//    *************************************************************
//    ************************ Service ************************
//    *************************************************************
   
    if(localStorage.boolservices  == "false"){
        document.getElementById("service").style.display="none";
//        $('#service').style.display="none";
//         $('#service').listview('refresh');
    }
    else{
        $.getJSON(localStorage.services,function(data,status){
                $('#serviceDIV').empty();
                $('#serviceDIV').append(data[0].service);
                $('#serviceDIV').listview('refresh');
        });
    };
//    *************************************************************

//    *************************************************************
//    ************************ Autre ************************
//    *************************************************************
    if(localStorage.boolautre  == "false"){
        document.getElementById("autre").style.display="none";
//        $('#autre').style.display="none";
    }
    else{
        $.getJSON(localStorage.autre,function(data,status){
                $('#autre').empty();
                $('#autre').append(data[0].autre);
                $('#autre').listview('refresh');
        });
    }
//    *************************************************************

//    *************************************************************
//    ************************ Offres Spéciale ********************
//    *************************************************************
    if(localStorage.booloffers == "false"){
        document.getElementById("OffresSpeciale").style.display="none";
//        $('#OffresSpeciale').style.display="none";
    }

//    *************************************************************
    
};


$(function(){
        if(localStorage.Email!=undefined && localStorage.code != undefined){
            nameID               = document.getElementById("name");
            nameID.innerHTML     = localStorage.name;
            compagnyID           = document.getElementById("compagny");
           // compagnyID.innerHTML = localStorage.compagny; 
            numeroID             = document.getElementById("Numero");
            numeroID.innerHTML   = localStorage.membreNumber;
            organisationID       = document.getElementById("organisation");
            organisationID.innerHTML = localStorage.organisation;
            
            //        setup display in html
//        localStorage.booloffers = true;
//            localStorage.boolmarchandlist = "true";
//            localStorage.boolevents = "false";
//            
//            localStorage.boolrestauration  = "true";
//            localStorage.boolservices = "false";
//            localStorage.boolmobilier = "true";
//            localStorage.boolprovinciaux = "false";
//            localStorage.booloffers = "false";
            
//        if(localStorage.booloffers == "true"){
//            OffresSpeciale = 
//                document.getElementById("OffresSpeciale").style.display="none";
//            OffresSpeciale.className += 'Hide';
//        };
        
//        if(localStorage.boolevents == "false"){
//             document.getElementById("events").style.display="none";
//        };
//        
//        if(localStorage.boolmarchandlist == "false"){
//             document.getElementById("ListeDesMarchands").style.display="none";
//        };
        
            if(localStorage.boolmarchandlist == "false"){
                document.getElementById('ListeDesMarchands').style.display="none";
            }
            if(localStorage.boolevents == "false"){
                document.getElementById('events').style.display="none";
            }
            
            window.location.href = "#page2";
            }
         else{
            window.location.href = "#page1";
            }
});

//Pour cacher la nav bar
window.addEventListener("load",function() {
    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);
});


function Validate(){        
    email = document.getElementById('email').value;
    code  = document.getElementById('code').value; 
    
    $.ajax({
    url:'https://5m1qfi37ie.execute-api.eu-west-1.amazonaws.com/Dev/emailCode',
//    url: 'https://mr0pwkh059.execute-api.eu-west-1.amazonaws.com/Dev/emailCode',

    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({email, code}),
            
    success: function(res) {
    if(res.answer == 'userFind'){
    nameID               = document.getElementById("name");
    nameID.innerHTML     = res.info.name;
    compagnyID           = document.getElementById("compagny");
    compagnyID.innerHTML = res.info.company;
    numeroID           = document.getElementById("Numero");
    numeroID.innerHTML = "#"+res.info.memberNumber;
    organisationID     = document.getElementById("organisation");
    organisationID.innerHTML = res.info.organisation;
        
    urlRestauration       = res.info.restauration;
    urlMobilier           = res.info.mobilier;
    urlService            = res.info.service;
    urlProvinciaux        = res.info.provinciaux;
    urlAutres             = res.info.autres;
    urlEvents          = res.info.urlEvents;
    urlOffers          = res.info.urlOffers;
    codeBar            = res.info.codeBar;     

    localStorage.Email         = email;
    localStorage.code          = code;

//        display rules
    localStorage.booloffers       = res.info.booloffers;
    localStorage.boolevents       = res.info.boolevents;
    localStorage.boolmarchandlist = res.info.boolmarchandlist;
    localStorage.boolrestauration = res.info.boolrestauration;
    localStorage.boolservices     = res.info.boolservices;
    localStorage.boolmobilier     = res.info.boolmobilier;
    localStorage.boolprovinciaux  = res.info.boolprovinciaux;
    localStorage.boolautre  = res.info.boolautre;

//        pour afficher sur la carte
    localStorage.name          = res.info.name;
    localStorage.compagny      = res.info.company;
    localStorage.organisation  = res.info.organisation;
    localStorage.membreNumber  = "#"+res.info.memberNumber;
        
//        url WebView
    localStorage.urlEvents     = urlEvents;
    localStorage.urlOffers     = urlOffers;
        
//        code bar du membre
    localStorage.codeBar       = codeBar;   
    
//        url des fichiers JSON
    localStorage.mobilier       = urlMobilier;
    localStorage.restauration   = urlRestauration;
    localStorage.service        = urlService;
    localStorage.provinciaux    = urlProvinciaux;
    localStorage.autre          = urlAutres;
        
    window.location.href = "#page2";
    }
    else{
        window.location.href = "#page1";
        if(res.answer == 'userNotFind'){
        tentative = tentative +1;
        if(tentative < 3){
            var myCollection = document.getElementsByTagName("label");
            if(tentative==1){
               myCollection[4].innerHTML = "Le Courriel ou le code n'est pas correct, veuillez réessayer de nouveau.";
            }
            else{
               myCollection[5].innerHTML = "Le Courriel ou le code n'est pas correct, veuillez réessayer de nouveau.";
            }
        }
        else{
            var myCollection = document.getElementsByTagName("label");
            myCollection[5].innerHTML = "Veuillez contacter l'administration de votre organisation";
        }
       }
    }
  },
error: function(res) {
 alert("Erreur de lecture: "+ res.message);
}
});
}
