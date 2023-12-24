const displayTime = document.querySelector(".display-time");

// Time
function showTime() {
  let time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let period = hours >= 12 ? 'PM' : 'AM';

  // Convert to twelve-hour format
  hours = hours % 12 || 12; // Handle midnight (0 hours) as 12 AM

  // Ensure minutes are displayed with two digits (e.g., 05 instead of 5)
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Wrap the ":" within a span with the class "blink"
  const timeFormat = `${hours}<span class="blink">:</span>${minutes} <span class="period">${period}</span>`;
  
  displayTime.innerHTML = timeFormat;
}

showTime();

// Date
function updateDate() {
  let today = new Date();

  let dayName = today.getDay(),
    dayNum = today.getDate(),
    month = today.getMonth(),
    year = today.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const IDCollection = ["day", "daynum", "month", "year"];
  const val = [dayWeek[dayName], dayNum, months[month], year];

  for (let i = 0; i < IDCollection.length; i++) {
    document.getElementById(IDCollection[i]).textContent = val[i];
  }
}

updateDate();

// Update time every second
setInterval(showTime, 1000);
