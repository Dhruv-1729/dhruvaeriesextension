console.log("Content script loaded");

// gets data from table
function calculateGrade() {
    const rows = document.querySelectorAll("tr[id^='ctl00_MainContent_subGBS_DataSummary_']");

    // rows confirmation
    if (rows.length === 0) {
        console.error("Error: No valid data rows found in the table.");
        return { success: false, message: "Error: could not fetch data" };
    }

    let totalWeight = 0;
    let weightedSum = 0;

    // iterate over table
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll("td");

        const weightText = cells[1]?.innerText.trim(); // "Perc of Grade" column
        const gradeText = cells[4]?.innerText.trim();  // "Perc" column

        //debug
        console.log(`Row ${index} - Weight: ${weightText}, Grade: ${gradeText}`);

        if (weightText && gradeText) {
            const weight = parseFloat(weightText.replace("%", "")) / 100;
            const gradePercentage = parseFloat(gradeText.replace("%", "")) / 100;

            weightedSum += weight * gradePercentage;
            totalWeight += weight;
        }
    });

    // error checker
    if (totalWeight === 0) {
        console.error("Error: Total weight is zero.");
        return { success: false, message: "Error: could not fetch data" };
    }

    // calculate the final percentgae
    const finalGrade = (weightedSum / totalWeight) * 100;
    console.log("Calculated grade:", finalGrade.toFixed(2));

   // return
    return { success: true, grade: finalGrade.toFixed(2) };
}

// event listenr
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "calculateGrade") {
        console.log("Message received in content script to calculate grade");

        // call calculateGrade and send the result 
        const result = calculateGrade();
        sendResponse(result);
    }
});
