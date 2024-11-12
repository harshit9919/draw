

// Google Sheets CSV export URL
const fileUrl = 'https://docs.google.com/spreadsheets/d/1ppYBgITkwuHTFsqlzjOU5YqsdVLjkcwtKmpOSYVpoZI/export?format=csv';

document.getElementById("draw-btn").addEventListener("click", drawWinners);

let participants = [];

// Check if the draw has already been made
if (localStorage.getItem('drawCompleted') === 'true') {
    // If the draw has been completed, disable the button and show an error message
    document.getElementById("draw-btn").disabled = true;
    document.getElementById("error-message").style.display = 'block';
} else {
    // Otherwise, fetch the sheet data and enable the button
    fetchAndProcessFile(fileUrl);
}

// Fetch and process the CSV file from Google Sheets
function fetchAndProcessFile(url) {
    fetch(url)
        .then(response => response.text())  // Get the file as text (CSV format)
        .then(data => {
            // Parse the CSV data using PapaParse
            Papa.parse(data, {
                header: true,  // The first row contains headers
                skipEmptyLines: true,  // Skip empty lines
                complete: function(results) {
                    // Assuming the 'Name' column exists in the CSV
                    participants = results.data.map(row => row.Name).filter(name => name); // Extract names from the 'Name' column
                    console.log("Participants:", participants);
                },
                error: function(error) {
                    console.error("Error parsing CSV file:", error);
                    alert("Failed to parse CSV file.");
                }
            });
        })
        .catch(error => {
            console.error("Error fetching the file:", error);
            alert("Failed to fetch or load the CSV file.");
        });
}

// Draw winners function
function drawWinners() {
    if (participants.length === 0) {
        alert("No participants loaded. Please check the file.");
        return;
    }

    // Shuffle the array of participants
    const shuffled = shuffleArray(participants);

    // Select the top 5 winners
    const winners = shuffled.slice(0, 5);

    // Display the winners
    document.getElementById("first-winner").textContent = `1st Winner: ${winners[0]}`;
    document.getElementById("second-winner").textContent = `2nd Winner: ${winners[1]}`;
    document.getElementById("third-winner").textContent = `3rd Winner: ${winners[2]}`;
    document.getElementById("fourth-winner").textContent = `4th Winner: ${winners[3]}`;
    document.getElementById("fifth-winner").textContent = `5th Winner: ${winners[4]}`;

    // Disable the draw button after the winners have been drawn
    document.getElementById("draw-btn").disabled = true;

    // Store in localStorage that the draw has been completed
    localStorage.setItem('drawCompleted', 'true');

    // Show error message
    document.getElementById("error-message").style.display = 'block';
}

// Shuffle function to randomize the array
function shuffleArray(array) {
    const shuffledArray = array.slice(); // Clone the array to avoid modifying the original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}
