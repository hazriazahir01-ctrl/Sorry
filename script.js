let html = `<div class="section">
  <h3>Respondent ${r + 1}</h3>

  <p><b>Rank Factors</b></p>
  DE: ${dropdown(`de${r}`)}
  JQ: ${dropdown(`jq${r}`)}
  FA: ${dropdown(`fa${r}`)}
  C: ${dropdown(`c${r}`)}

  <p><b>Self Driving</b></p>
  ${dropdown(`sd${r}de`)}
  ${dropdown(`sd${r}jq`)}
  ${dropdown(`sd${r}fa`)}
  ${dropdown(`sd${r}c`)}

  <p><b>Carpooling</b></p>
  ${dropdown(`cp${r}de`)}
  ${dropdown(`cp${r}jq`)}
  ${dropdown(`cp${r}fa`)}
  ${dropdown(`cp${r}c`)}

  <p><b>E-hailing</b></p>
  ${dropdown(`eh${r}de`)}
  ${dropdown(`eh${r}jq`)}
  ${dropdown(`eh${r}fa`)}
  ${dropdown(`eh${r}c`)}

  <p><b>Public Transport</b></p>
  ${dropdown(`pt${r}de`)}
  ${dropdown(`pt${r}jq`)}
  ${dropdown(`pt${r}fa`)}
  ${dropdown(`pt${r}c`)}
</div>`;