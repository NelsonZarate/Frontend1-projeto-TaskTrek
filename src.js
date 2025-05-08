document.addEventListener('DOMContentLoaded', () => {
  // Update the time every second
  setInterval(displayCurrentTime, 1000);
  // Initial call to display the time immediately
  displayCurrentTime();
  class CustomFooter extends HTMLElement {
    year = getYear();
    connectedCallback() {
      // Insert HTML content for the menu
      this.innerHTML = ` <footer class="text-center py-4 bg-light mt-5 border-top">
        <p class="mb-0">&copy ${this.year} TaskTrek. All rights reserved.</p>
        </footer>
  `;
    }
  }

  // Register the custom element with the tag 'my-custom-menu'
  customElements.define('my-custom-footer', CustomFooter);
});

function displayCurrentTime() {
  const now = new Date(); // Get the current date and time
  const formattedTime = now.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', hour: '2-digit' }); // Format the time (24-hour format)
  const timeElement = document.getElementById('time'); // Target the element to display time

  if (timeElement) {
    timeElement.textContent = formattedTime;
  }
}

function getYear() {
  // Get the current year
  const date = new Date();
  const year = date.getFullYear();
  // Display the current year in the 
  return year;
}
