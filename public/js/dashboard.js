const interval = document.getElementById("show_time_interval");
const interval_slider = document.getElementById("interval_slider");
interval_slider.value = 5;

interval_slider.addEventListener("input", (event) => {
    const value = parseInt(event.target.value, 10);
    let displayValue;

    if (value <= 60) {
        displayValue = `${value} min`; // Show minutes for values 1 to 60
    } else {
        const hours = Math.floor((value - 60)); // Convert to hours
        displayValue = `${hours} hr`; // Show hours for values above 60
    }
    console.clear();
    console.log(displayValue); // Log the formatted value
    interval.textContent = displayValue; // Update the display element
});