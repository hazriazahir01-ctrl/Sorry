let respondents = [];

function startSurvey() {
  let n = document.getElementById("numRespondents").value;
  let surveyDiv = document.getElementById("survey");
  surveyDiv.innerHTML = "";

  respondents = [];

  for (let r = 0; r < n; r++) {
    let html = `<div class="section">
      <h3>Respondent ${r + 1}</h3>

      <p>Rank (1–4, no duplicates)</p>
      DE: <input type="number" id="de${r}"><br>
      JQ: <input type="number" id="jq${r}"><br>
      FA: <input type="number" id="fa${r}"><br>
      C: <input type="number" id="c${r}"><br>

      <p>Self Driving</p>
      <input id="sd${r}de"><input id="sd${r}jq">
      <input id="sd${r}fa"><input id="sd${r}c"><br>

      <p>Carpooling</p>
      <input id="cp${r}de"><input id="cp${r}jq">
      <input id="cp${r}fa"><input id="cp${r}c"><br>

      <p>E-hailing</p>
      <input id="eh${r}de"><input id="eh${r}jq">
      <input id="eh${r}fa"><input id="eh${r}c"><br>

      <p>Public Transport</p>
      <input id="pt${r}de"><input id="pt${r}jq">
      <input id="pt${r}fa"><input id="pt${r}c"><br>
    </div>`;

    surveyDiv.innerHTML += html;
  }

  document.getElementById("calculateBtn").style.display = "block";
}

function calculate() {
  let n = document.getElementById("numRespondents").value;

  let totalWeights = [0,0,0,0];
  let utilitiesAll = [];

  for (let r = 0; r < n; r++) {

    let ranks = [
      +document.getElementById(`de${r}`).value,
      +document.getElementById(`jq${r}`).value,
      +document.getElementById(`fa${r}`).value,
      +document.getElementById(`c${r}`).value
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
        +document.getElementById(prefix+"de").value,
        +document.getElementById(prefix+"jq").value,
        +document.getElementById(prefix+"fa").value,
        +document.getElementById(prefix+"c").value
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
    <p>Utilities: ${avgUtilities.map(x=>x.toFixed(2))}</p>
    <p>Probabilities: ${probabilities.map(x=>x.toFixed(3))}</p>
  `;

  drawCharts(avgUtilities, probabilities, avgWeights);
}

function drawCharts(util, prob, weight){

  new Chart(document.getElementById("utilityChart"), {
    type: 'bar',
    data: {
      labels: ["SD","CP","EH","PT"],
      datasets: [{ data: util }]
    }
  });

  new Chart(document.getElementById("probChart"), {
    type: 'bar',
    data: {
      labels: ["SD","CP","EH","PT"],
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
