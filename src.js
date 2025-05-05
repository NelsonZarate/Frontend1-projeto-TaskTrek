
function displayCurrentTime() {
    const now = new Date(); // Get the current date and time
    const formattedTime = now.toLocaleTimeString('en-US',{ hour12: false, minute: '2-digit', hour: '2-digit' }); // Format the time (24-hour format)
    const timeElement = document.getElementById('time'); // Target the element to display time
  
    if (timeElement) {
      timeElement.textContent = formattedTime; // Update the element with the current time
    }
  }

document.addEventListener('DOMContentLoaded', () => {
    // Update the time every second
    setInterval(displayCurrentTime, 1000);
  
    // Initial call to display the time immediately
    displayCurrentTime();
  });