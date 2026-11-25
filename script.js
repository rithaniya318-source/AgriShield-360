
// AG RISHIELD 360° — interactive prototype

function analyzeFarm() {
  const moisture = Number(document.getElementById("moisture").value);
  const temperature = Number(document.getElementById("temperature").value);
  const rainfall = Number(document.getElementById("rainfall").value);
  const crop = document.getElementById("crop").value;

  if (
    document.getElementById("moisture").value === "" ||
    document.getElementById("temperature").value === "" ||
    document.getElementById("rainfall").value === "" ||
    moisture < 0 || moisture > 100 ||
    temperature < -10 || temperature > 60 ||
    rainfall < 0 || rainfall > 1000
  ) {
    alert("Please enter valid readings. Moisture: 0–100%, temperature: -10–60°C, rainfall: 0–1000 mm.");
    return;
  }

  document.getElementById("moistureMetric").textContent = moisture + "%";
  document.getElementById("temperatureMetric").textContent = temperature + "°C";
  document.getElementById("rainfallMetric").textContent = rainfall + " mm";

  let risk = 0;
  let advice = [];

  // General demonstration thresholds, not crop-specific recommendations.
  if (moisture < 25) {
    risk += 2;
    advice.push("Soil moisture is low. Check the root-zone soil before deciding whether irrigation is needed.");
  } else if (moisture < 40) {
    risk += 1;
    advice.push("Soil moisture is on the lower side. Monitor it again and consider the crop's water requirement.");
  } else if (moisture > 80) {
    risk += 2;
    advice.push("Soil moisture is high. Check drainage and watch for waterlogging.");
  } else {
    advice.push("Soil moisture is within this demo's general monitoring range.");
  }

  if (temperature > 38) {
    risk += 2;
    advice.push("High temperature detected. Check for heat stress and maintain suitable irrigation practices.");
  } else if (temperature > 33) {
    risk += 1;
    advice.push("Temperature is elevated. Monitor plants during the hottest part of the day.");
  } else if (temperature < 10) {
    risk += 1;
    advice.push("Low temperature detected. Check whether the crop is sensitive to cold conditions.");
  } else {
    advice.push("Temperature is within this demo's general monitoring range.");
  }

  if (rainfall === 0) {
    risk += 1;
    advice.push("No rainfall was entered for the monitored period. Check soil moisture rather than relying on rainfall alone.");
  } else if (rainfall > 100) {
    risk += 2;
    advice.push("Heavy rainfall amount entered. Inspect field drainage and look for standing water.");
  } else {
    advice.push("Rainfall reading recorded. Continue monitoring local weather and field conditions.");
  }

  let status = "Good";
  let statusColor = "#247447";

  if (risk >= 4) {
    status = "Attention";
    statusColor = "#bd6234";
  } else if (risk >= 2) {
    status = "Monitor";
    statusColor = "#a77a20";
  }

  document.getElementById("statusMetric").textContent = status;
  document.getElementById("statusMetric").style.color = statusColor;

  const percentage = Math.min(100, Math.round((risk / 5) * 100));
  document.getElementById("riskBar").style.width = percentage + "%";
  document.getElementById("riskLabel").textContent =
    "Demo risk indicator: " + percentage + "% — not a scientific crop-disease or yield prediction.";

  const report =
    "Crop selected: " + crop + "\n\n" +
    advice.map((item, index) => (index + 1) + ". " + item).join("\n") +
    "\n\nThis is a basic rule-based demonstration. Actual crop needs depend on crop variety, growth stage, soil type, sensor calibration and local conditions.";

  document.getElementById("farmResult").textContent = report;
}


// FARM DOCTOR — prepares a consultation request in the browser.
document.getElementById("doctorForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("farmerName").value.trim();
  const crop = document.getElementById("doctorCrop").value.trim();
  const problem = document.getElementById("problem").value;
  const question = document.getElementById("doctorQuestion").value.trim();

  if (!name || !crop || !question) {
    alert("Please fill in all required fields.");
    return;
  }

  const result = document.getElementById("doctorResult");
  result.classList.remove("hidden");
  result.textContent =
    "CONSULTATION REQUEST PREPARED\n\n" +
    "Farmer: " + name + "\n" +
    "Crop: " + crop + "\n" +
    "Problem: " + problem + "\n" +
    "Question: " + question +
    "\n\nDemo only: this request has not been sent to an agricultural expert. A real consultation service must be connected.";
});


// SOIL ASSISTANT — general information, not a fertilizer prescription.
function getSoilAdvice() {
  const soilType = document.getElementById("soilType").value;
  const phText = document.getElementById("soilPh").value;
  const concern = document.getElementById("soilConcern").value;
  const output = document.getElementById("soilAdvice");

  let advice = [];

  if (phText !== "") {
    const ph = Number(phText);

    if (ph < 0 || ph > 14) {
      alert("Soil pH must be between 0 and 14.");
      return;
    }

    if (ph < 5.5) {
      advice.push("The entered pH is acidic. Ask a local soil-testing laboratory or agricultural officer whether soil amendment is appropriate.");
    } else if (ph <= 7.5) {
      advice.push("The entered pH is within a commonly suitable range for many crops, but ideal pH varies by crop.");
    } else {
      advice.push("The entered pH is alkaline. Check the soil-test report for nutrient availability and crop suitability.");
    }
  } else {
    advice.push("No pH value entered. Consider getting a soil test before selecting fertilizer.");
  }

  if (soilType === "Clay") {
    advice.push("Clay soil: avoid working it when very wet. Organic matter can help improve soil structure.");
  } else if (soilType === "Sandy") {
    advice.push("Sandy soil: organic matter can help improve water and nutrient retention. Irrigation may need closer monitoring.");
  } else if (soilType === "Loamy") {
    advice.push("Loamy soil: maintain organic matter and avoid excessive fertilizer application.");
  } else {
    advice.push("Unknown soil type: a local soil test can help identify texture and nutrient needs.");
  }

  if (concern === "growth") {
    advice.push("Poor growth can have several causes, including water, sunlight, pests, disease and nutrient imbalance. Inspect the whole plant.");
  } else if (concern === "yellow") {
    advice.push("Yellow leaves can be caused by nutrient deficiency, excess water, root damage or disease. Do not assume nitrogen deficiency without checking.");
  } else if (concern === "soil") {
    advice.push("For low fertility, use soil-test results to guide nutrient management and add fully matured compost where suitable.");
  } else {
    advice.push("For general improvement, combine soil testing, suitable organic matter, crop rotation and careful water management.");
  }

  output.textContent =
    advice.map((item, index) => (index + 1) + ". " + item).join("\n") +
    "\n\nImportant: this is general educational guidance, not a fertilizer brand, dose or application prescription. Confirm recommendations with a soil test and local agricultural expert.";
}


// FARMER CONNECT — local demonstration chat.
let selectedFarmer = "";

function openChat(farmerName) {
  selectedFarmer = farmerName;
  const chat = document.getElementById("chatWindow");

  chat.replaceChildren();

  const message = document.createElement("div");
  message.className = "chat-message received";
  message.textContent = "You opened a demo conversation with " + farmerName + ". Type a message below.";
  chat.appendChild(message);
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const chat = document.getElementById("chatWindow");
  const messageText = input.value.trim();

  if (!messageText) {
    return;
  }

  if (!selectedFarmer) {
    alert("Please select a sample farmer first.");
    return;
  }

  const sent = document.createElement("div");
  sent.className = "chat-message sent";
  sent.textContent = "You: " + messageText;
  chat.appendChild(sent);

  const reply = document.createElement("div");
  reply.className = "chat-message received";
  reply.textContent =
    "Demo reply from " + selectedFarmer +
    ": Thank you for sharing. Let's discuss this farming issue.";
  chat.appendChild(reply);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;
}


// Language button — Tamil translation is a future enhancement.
function toggleLanguage() {
  alert("Tamil language support is planned for the next version. This prototype currently displays English content.");
}
