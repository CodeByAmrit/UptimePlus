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

document.getElementById("add_monitor_form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const name = form.elements["name"].value;
    const url = form.elements["url"].value;
    const interval = form.elements["interval"].value;
    const type = form.elements["type"].value;

    const data = { name, url, interval, type };

    try {
        const response = await fetch('/monitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log("Monitor added successfully");
            location.href = "/dashboard"; // Redirect to the dashboard page
        } else {
            console.error("Failed to add monitor");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

const deleteButtons = document.getElementsByClassName("delete_monitor_button");

Array.from(deleteButtons).forEach((button) => {
    button.addEventListener("click", async (event) => {
        const monitorId = event.target.getAttribute("data-monitor-id");

        if (!monitorId) {
            console.error("Monitor ID not found");
            return;
        }

        try {
            const response = await fetch(`/monitors/${monitorId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Monitor deleted successfully");
                location.reload(); // Reload the page to reflect changes
            } else {
                console.error("Failed to delete monitor");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});