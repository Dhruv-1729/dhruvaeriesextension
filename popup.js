// popup.js

function displayResult(result) {
    const resultElement = document.getElementById("result");

    if (result.success) {
        // success messge
        resultElement.innerHTML = `
            <div class="success-message">Succeeded!</div>
            <div class="grade-label">Overall Grade is</div>
            <div class="grade-value">${result.grade}%</div>
        `;
    } else {
        // error stuff
        resultElement.innerHTML = `<span style="color: red;">${result.message}</span>`;
    }
}

// calculate button
document.getElementById("calculate").addEventListener("click", () => {
    console.log("Button clicked: sending message to content script");
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "calculateGrade" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Runtime error:", chrome.runtime.lastError.message);
                displayResult({ success: false, message: "Error: could not fetch data" });
            } else {
                console.log("Response received from content script:", response);
                displayResult(response || { success: false, message: "No response from content script" });
            }
        });
    });
});
