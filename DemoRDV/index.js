// Pour la partie client
var interval = 2; // how big single slot should be (in this case 2 hrs)
var sendComment, sendUsername, sendTel, sendMail;
var startBookDate, endBookDate;

// ========== for the modal window ==========
// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

document.addEventListener("DOMContentLoaded", function () {
  query();
});

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// ========== for the modal window ==========

function query() {
  $.post(
    "https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ",
    { Instructions: "getDatesValues" },
    function (result) {
      id = "5shl6ad2n056oquag39idg64c0@group.calendar.google.com";

      endDate = new Date();

      var date = new Date();
      var startDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );

      startDate = startDate.toISOString();
      console.log("startDate: " + startDate);

      slotsFromEvents(startDate, result);

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

        while (freeDay < 400) {
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
              Occupation: occup,
            });
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
    function (result) {
      var eventsAvailabilities = [];
      console.log("result: " + JSON.stringify(result));

      result.map((event, i) => {
        item = {};
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

function insertDates(bookDate) {
  $.post(
    "https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ",
    { Instructions: "insertDatesValues", event: bookDate },
    function (result) {
      if (result.dates != undefined) {
        alert("got dates! ");
      } else {
        alert("Cette date est prise veuillez choisir une autere date.");
      }
    }
  );
}

function CheckAndinsertDates(bookDate) {
  $.post(
    "https://us-central1-onlinecalendar-a-1579919061066.cloudfunctions.net/FirstCalendar ",
    { Instructions: "insertDatesValues", event: bookDate },
    function (result) {
      if (result.updates == "booked") {
        alert("Cette date est prise veuillez choisir une autere date.");
      } else if (result.updates == "notBooked") {
        alert("Votre réservation est confirmée ");
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
    // To display an clicked event
    eventClick: function (info) {
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
      startBookDate =
        year + "-" + month + "-" + date + "T" + houres + ":" + minutes + ":00";
      houres = parseInt(houres) + 2;
      endBookDate =
        year + "-" + month + "-" + date + "T" + houres + ":" + minutes + ":00";
      info.el.style.borderColor = "red";
    },
    // ============
    plugins: ["interaction", "timeGrid"],
    header: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    defaultDate: currentDate,
    navLinks: true, // can click day/week names to navigate views
    businessHours: {
      startTime: "08:00", // a start time (10am in this example)
      endTime: "18:00", // an end time (6pm in this example)
    },
    weekends: false,
    allDaySlot: false,
    locale: "fr",
    events: eventsAvailabilities,
  });
  calendar.render();
}
function bookDate() {
  service = document.getElementById("Mobility").value;
  sendComment = document.getElementById("exampleFormControlTextarea2").value;
  sendUsername = document.getElementById("defaultContactFormName").value;
  sendMail = document.getElementById("defaultContactFormEmail").value;
  sendTel = document.getElementById("defaultContactFormTel").value;
  sendComment =
    "Service: " +
    service +
    " \n " +
    "-----------" +
    " \n " +
    sendComment +
    " \n " +
    "-----------" +
    " \nTél: " +
    sendTel;
  var bookDate = {
    summary: sendUsername,
    location: sendMail,
    description: sendComment,
    end: {
      dateTime: endBookDate,
      timeZone: "America/New_York",
    },
    start: {
      dateTime: startBookDate,
      timeZone: "America/New_York",
    },

    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  CheckAndinsertDates(bookDate);
  document.getElementById("id01").style.display = "none";
}
