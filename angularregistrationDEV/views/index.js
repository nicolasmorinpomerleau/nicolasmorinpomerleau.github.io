var interval = 2; // how big single slot should be (in this case 2 hrs)
var sendComment, sendUsername, sendTel, sendMail;
var startBookDate, endBookDate;

// var semaphor = flase;

// ========== for the modal window ==========
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
// btn.onclick = function() {
//   modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// ========== for the modal window ==========

function query() {
  // var element = document.getElementById("calendar");
  // if(semaphor){
  //   $("#calendar").remove();
  // };
  // semaphor =true;

  $.post(
    "https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ",
    { Instructions: "query" },
    function(result) {
      id = "5shl6ad2n056oquag39idg64c0@group.calendar.google.com";

      endDate = new Date();

      var date = new Date();
      var startDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );

      // var usaTime = new Date().toLocaleString("en-US", {
      //   timeZone: "America/New_York"
      // });
      // usaTime = new Date(usaTime);
      // console.log("USA time: " + usaTime);
      // usaTime = usaTime.toISOString();
      // console.log('USA time: '+usaTime.  );
      // console.log("USA time to ISO: " + usaTime);
      startDate = startDate.toISOString();
      //  = (new Date()).toISOString();
      console.log("startDate: " + startDate);

      slotsFromEvents(startDate, result.busy);

      function slotsFromEvents(startDate, events) {
        ISOSartDates = new Date(startDate);

        // Trick to convert to local time zone
        ISOSartDates = ISOSartDates.toISOString();
        var ISOSartDates = ISOSartDates.split(".");
        ISOSartDates = ISOSartDates[0] + "-05:00";
        ISOSartDates = new Date(ISOSartDates);
        // Trick to convert to local time zone

        if (events[0]) {
          // I don't know what is this 'if' for
          ISOEvents = new Date(events[0].start);
          dates = ISOEvents.getDate();
        }

        eventsDays = [];
        var freeDay = 0;
        var slots = 5;
        var startHours = 9;
        var occup = "Free";

        while (freeDay < 10) {
          slots = 5;
          while (slots > 0) {
            occup = "Free";
            weekEndDay = ISOSartDates.getDay();
            if (weekEndDay == 0 || weekEndDay == 6) {
              occup = "Busy";
            }

            eventsDays.push({
              Year: ISOSartDates.getFullYear(),
              Month: ISOSartDates.getMonth() + 1,
              CurrentDay: ISOSartDates.getDate(),
              Start: startHours,
              // Start: ISOSartDates.getHours(),
              Occupation: occup
            });
            // ISOSartDates.setHours(ISOSartDates.getHours() + 2);
            startHours = startHours + interval;
            slots--;
          }
          ISOSartDates.setDate(ISOSartDates.getDate() + 1);
          startHours = 9;
          freeDay++;
        }

        events.forEach(myFunction1);

        function myFunction1(event, i) {
          busyDate = new Date(event.start);

          busyDateYear = busyDate.getFullYear();
          busyDateMonth = busyDate.getMonth();
          busyDateMonth = busyDateMonth + 1;
          busyDateDay = busyDate.getDate();
          busyDateHours = busyDate.getHours();

          eventsDays.forEach(putBusyDays);

          function putBusyDays(eventDay, i) {
            if (
              eventDay.Year == busyDateYear &&
              eventDay.Month == busyDateMonth &&
              eventDay.CurrentDay == busyDateDay &&
              eventDay.Start == busyDateHours
            ) {
              eventDay.Occupation = "Busy";
            }
          }
        }

        DisplayAvailabilities(eventsDays);
      }
    }
  );
}

function DisplayAvailabilities(eventsDays) {
  var eventsAvailabilities = [];

  eventsDays.map((event, i) => {
    if (event.Occupation == "Free") {
      //================ Start hour ================
      year = event.Year.toString().concat("-");

      month = pad(event.Month, 2);
      month = year.concat(month);
      month = month.concat("-");

      day = pad(event.CurrentDay, 2);
      day = month.concat(day);
      day = day.concat("T");

      hour = pad(event.Start, 2);
      hour = day.concat(hour);
      start = hour.concat(":00:00");

      //================ End hour ================
      year = event.Year.toString().concat("-");

      month = pad(event.Month, 2);
      month = year.concat(month);
      month = month.concat("-");

      day = pad(event.CurrentDay, 2);
      hour = event.Start + interval;
      day = month.concat(day);
      day = day.concat("T");

      hour = pad(hour, 2);
      hour = day.concat(hour);
      end = hour.concat(":00:00");

      item = {};
      item["title"] = "Disponible";
      item["start"] = start;
      item["end"] = end;
      eventsAvailabilities.push(item);
    }
  });

  function pad(num, size) {
    var num = num + "";
    if (num.length < size) {
      num = "0" + num;
    }
    return num;
  }

  console.log("eventsAvailabilities: " + JSON.stringify(eventsAvailabilities));
  fillCalendar(eventsAvailabilities);
}

// Peut être utilisé pour le UI du coiffeur
function readDates() {
  $.post(
    "https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ",
    { Instructions: "getDatesValues" },
    function(result) {
      var eventsAvailabilities = [];
      console.log("result: " + JSON.stringify(result));

      result.map((event, i) => {
        // const start = event.start.dateTime || event.start.date;
        // console.log(`${start} - ${event.summary}`);
        // console.log(' event stringify: '+JSON.stringify(event));
        item = {};
        //item ["title"] = event.summary; no need for this parameter because we will put "available" all time.
        item["title"] = "Disponible";
        item["start"] = event.start;
        item["end"] = event.end;
        eventsAvailabilities.push(item);
      });
      console.log(
        "eventsAvailabilities: " + JSON.stringify(eventsAvailabilities)
      );
      fillCalendar(eventsAvailabilities);
    }
  );
}

function updateDates(bookDate) {
  $.post(
    "https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ",
    { Instructions: "updatesDatesValues", event: bookDate },
    function(result) {
      if (result.dates != undefined) {
        alert("got dates! ");
      }
    }
  );
}

// Get current dates
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth();
var day = d.getDate();
var currentDate = new Date(year, month, day + 1);

//   document.addEventListener('DOMContentLoaded', function() {
function fillCalendar(eventsAvailabilities) {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    // To display the date which is not an event yet
    // dateClick: function(info) {
    //   alert("Date: " + info.dateStr);
    //   alert("Resource ID: " + info.resource.id);
    // },
    // ========

    // To display an clicked event
    eventClick: function(info) {
      // alert('Event: ' + info.event.title);
      // alert("Dates start " + info.event.start + " Dates End" + info.event.end);
      // alert('View: ' + info.view.type);
      // modal.style.display = "block";

      document.getElementById("id01").style.display = "block";
      var str = JSON.stringify(info.event.start);
      date = info.event.start.getDate();
      month = info.event.start.getMonth();
      month = month + 1;
      month = pad(month, 2);
      year = info.event.start.getFullYear();
      houres = info.event.start.getHours();
      houres = pad(houres, 2);

      minutes = info.event.start.getMinutes();
      minutes = pad(minutes, 2);

      function pad(num, size) {
        var num = num + "";
        if (num.length < size) {
          num = "0" + num;
        }
        return num;
      }

      dateHeure =
        "Rendez-vous du: " +
        date +
        "-" +
        month +
        "-" +
        year +
        " à: " +
        houres +
        "h" +
        minutes +
        ". ";
      document.getElementById("modalTitle").innerText = dateHeure;
      // abou
      startBookDate =
        year + "-" + month + "-" + date + "T" + houres + ":" + minutes + ":00";
      houres = parseInt(houres) + 2;
      endBookDate =
        year + "-" + month + "-" + date + "T" + houres + ":" + minutes + ":00";

      // 2020-03-13T17:00:00
      // change the border color just for fun
      info.el.style.borderColor = "red";
    },
    // ============
    plugins: ["interaction", "timeGrid"],
    header: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
    },
    // defaultDate: '2019-08-12',
    defaultDate: currentDate,
    navLinks: true, // can click day/week names to navigate views
    // businessHours: true, // display business hours
    businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      // daysOfWeek: [ 1, 2, 3, 4,5 ], // Monday - Thursday

      startTime: "08:00", // a start time (10am in this example)
      endTime: "18:00" // an end time (6pm in this example)
    },
    // editable: true,
    weekends: false,
    allDaySlot: false,
    // slotDuration:'08:00:00',
    // timeZone: 'local',
    locale: "fr",
    // eventsAvailabilities
    events: eventsAvailabilities
    // [
    //     {
    //       title: 'Disponible',
    //       start: '2020-03-03T13:00:00',
    //       end:'2020-03-03T14:00:00'
    //       // constraint: 'businessHours'
    //     },
    //     {
    //       title: 'Disponible',
    //       start: '2020-03-04T14:00:00',
    //       end:'2020-02-04T15:00:00'
    //       // constraint: 'businessHours'
    //     },
    //     {
    //       title: 'Disponible',
    //       start: '2020-03-04T15:00:00',
    //       end:'2020-03-04T16:00:00'
    //       // constraint: 'businessHours'
    //     },
    //     {
    //       title: 'Meeting',
    //       start: '2020-02-13T11:00:00',
    //       constraint: 'availableForMeeting', // defined below
    //       color: '#257e4a'
    //     },
    //     {
    //       title: 'Conference',
    //       start: '2020-02-18',
    //       end: '2020-02-18'
    //     },
    //     {
    //       title: 'Party',
    //       start: '2020-02-29T20:00:00'
    //     },

    //     // areas where "Meeting" must be dropped
    //     {
    //       groupId: 'availableForMeeting',
    //       start: '2019-08-14T10:00:00',
    //       end: '2019-08-15T16:00:00',
    //       rendering: 'background'
    //     },
    //     {
    //       groupId: 'availableForMeeting',
    //       start: '2019-08-13T10:00:00',
    //       end: '2019-08-13T16:00:00',
    //       rendering: 'background'
    //     },

    //     // red areas where no events can be dropped
    //     {
    //       start: '2019-08-24',
    //       end: '2019-08-28',
    //       overlap: false,
    //       rendering: 'background',
    //       color: '#ff9f89'
    //     },
    //     {
    //       start: '2019-08-06',
    //       end: '2019-08-08',
    //       overlap: false,
    //       rendering: 'background',
    //       color: '#ff9f89'
    //     }
    //   ]
  });
  calendar.render();
}
function bookDate() {
  sendComment = document.getElementById("comment").value;
  sendUsername = document.getElementById("username").value;
  sendMail = document.getElementById("mail").value;
  sendTel = document.getElementById("tel").value;
  sendComment = sendComment + " \n\nTél: " + sendTel;
  var bookDate = {
    summary: sendUsername,
    location: sendMail,
    description: sendComment,
    // summary: "Nom",
    // location: "Courriel",
    // description: "Commentaire",
    end: {
      dateTime: endBookDate,
      timeZone: "America/New_York"
    },
    start: {
      dateTime: startBookDate,
      timeZone: "America/New_York"
    },
    // 'recurrence': [
    //   'RRULE:FREQ=DAILY;COUNT=2'
    // ],
    // 'attendees': [
    // {'email': 'aboumekh@gmail.com'}
    // {'email': 'sbrin@example.com'},
    //],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 }
      ]
    }
  };
  // bookDate["summary"] = sendUsername;
  // bookDate["location"] = sendMail;
  // bookDate["description"] = sendComment;

  updateDates(bookDate);
  document.getElementById("id01").style.display = "none";
}
