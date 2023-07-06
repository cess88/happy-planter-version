
let frequenceObject = {
  "jours": "daily",
  "sems": "weekly",
  "mois": "monthly"
}

let intervalObject = {
  'daily': {
    "interval" : 1,
    "typeRules": "byweekday"
  },
    "weekly": {
    "interval" : 7,
    "typeRules": "byweekday", 
  },
  "monthly": {
    "interval" : 30,
    "typeRules": "bymonthday", 
  }

}





document.addEventListener('DOMContentLoaded', function () {
  let wateringData = document.querySelector("#dataWater").getAttribute("data-watering")
  wateringData = wateringData.split("/")
  wateringData[0] = parseInt(wateringData[0])
  let calendarEl = document.getElementById('calendar');
  let typeRules =   intervalObject[frequenceObject[wateringData[1]]].typeRules
  let event =  {
    title: 'my recurring event',
    rrule: {
      freq: frequenceObject[wateringData[1]],
    }
  }
  event.rrule[typeRules] = [1]
  console.log(wateringData[0]);
  if (wateringData[0] == 2) {
    event.rrule[typeRules].push(Math.round(intervalObject[frequenceObject[wateringData[1]]].interval / 2))
  }
  console.log( event.rrule);
 
  let calendar = new FullCalendar.Calendar(calendarEl, {
    // Options de configuration du calendrier
    // ...
   
    events: [
      event
    ]
  });

  // 2/sems

  calendar.render();
});