function ratingGroup(name) {
  return `
    <div class="rating-group">
      ${[1,2,3,4].map(val => `
        <label>
          <input type="radio" name="${name}" value="${val}">
          <span>${val}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function startSurvey() {
  let n = document.getElementById("numRespondents").value;
  let surveyDiv = document.getElementById("survey");
  surveyDiv.innerHTML = "";

  for (let r = 0; r < n; r++) {

    let html = `<div class="section">
      <h3>Respondent ${r + 1}</h3>

      <p><b>Rank Factors (1 = Most Important)</b></p>
      DE: ${ratingGroup(`de${r}`)}
      JQ: ${ratingGroup(`jq${r}`)}
      FA: ${ratingGroup(`fa${r}`)}
      C: ${ratingGroup(`c${r}`)}

      <p><b>Self Driving</b></p>
      DE ${ratingGroup(`sd${r}de`)}
      JQ ${ratingGroup(`sd${r}jq`)}
      FA ${ratingGroup(`sd${r}fa`)}
      C ${ratingGroup(`sd${r}c`)}

      <p><b>Carpooling</b></p>
      DE ${ratingGroup(`cp${r}de`)}
      JQ ${ratingGroup(`cp${r}jq`)}
      FA ${ratingGroup(`cp${r}fa`)}
      C ${ratingGroup(`cp${r}c`)}

      <p><b>E-hailing</b></p>
      DE ${ratingGroup(`eh${r}de`)}
      JQ ${ratingGroup(`eh${r}jq`)}
      FA ${ratingGroup(`eh${r}fa`)}
      C ${ratingGroup(`eh${r}c`)}

      <p><b>Public Transport</b></p>
      DE ${ratingGroup(`pt${r}de`)}
      JQ ${ratingGroup(`pt${r}jq`)}
      FA ${ratingGroup(`pt${r}fa`)}
      C ${ratingGroup(`pt${r}c`)}

    </div>`;

    surveyDiv.innerHTML += html;
  }

  document.getElementById("calculateBtn").style.display = "block";
}

function getRadioValue(name) {
  let selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? parseInt(selected.value) : 0;
}

function calculate() {
  let n = document.getElementById("numRespondents").value;

  let totalWeights = [0,0,0,0];
  let utilitiesAll = [];

  for (let r = 0; r < n; r++) {

    let ranks = [
      getRadioValue(`de${r}`),
      getRadioValue(`jq${r}`),
      getRadioValue(`fa${r}`),
      getRadioValue(`c${r}`)
    ];

    if (new Set(ranks).size !== 4) {
      alert("Ranking must be unique!");
      return;
    }

    let weightsRaw = ranks.map(x => 5 - x);
    let sumW = weightsRaw.reduce((a,b)=>a+b,0);
    let weights = weightsRaw.map(x => x/sumW);

    for (let i=0;i<4;i++) totalWeights[i]+=weights[i];

    function getVals(prefix){
      return [
        getRadioValue(prefix+"de"),
        getRadioValue(prefix+"jq"),
        getRadioValue(prefix+"fa"),
        getRadioValue(prefix+"c")
      ];
    }

    let SD = getVals(`sd${r}`);
    let CP = getVals(`cp${r}`);
    let EH = getVals(`eh${r}`);
    let PT = getVals(`pt${r}`);

    function utility(arr){
      return arr.reduce((sum,val,i)=>sum+val*weights[i],0);
    }

    utilitiesAll.push([
      utility(SD),
      utility(CP),
      utility(EH),
      utility(PT)
    ]);
  }

  let avgWeights = totalWeights.map(x=>x/n);

  let avgUtilities = [0,0,0,0];
  utilitiesAll.forEach(u=>{
    for(let i=0;i<4;i++) avgUtilities[i]+=u[i];
  });
  avgUtilities = avgUtilities.map(x=>x/n);

  let expU = avgUtilities.map(Math.exp);
  let sumExp = expU.reduce((a,b)=>a+b,0);
  let probabilities = expU.map(x=>x/sumExp);

  document.getElementById("results").innerHTML = `
    <h2>Results</h2>
    <p><b>Utilities:</b> ${avgUtilities.map(x=>x.toFixed(2)).join(", ")}</p>
    <p><b>Probabilities:</b> ${probabilities.map(x=>x.toFixed(3)).join(", ")}</p>
  `;

  drawCharts(avgUtilities, probabilities, avgWeights);
}

function drawCharts(util, prob, weight){

  new Chart(document.getElementById("utilityChart"), {
    type: 'bar',
    data: {
      labels: ["Self Driving","Carpooling","E-hailing","Public Transport"],
      datasets: [{ data: util }]
    }
  });

  new Chart(document.getElementById("probChart"), {
    type: 'bar',
    data: {
      labels: ["Self Driving","Carpooling","E-hailing","Public Transport"],
      datasets: [{ data: prob }]
    }
  });

  new Chart(document.getElementById("weightChart"), {
    type: 'bar',
    data: {
      labels: ["DE","JQ","FA","C"],
      datasets: [{ data: weight }]
    }
  });
}