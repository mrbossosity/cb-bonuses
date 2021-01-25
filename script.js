var bonusesArr = [];
$.getJSON("https://mrbossosity.github.io/college-bowl-collections/collegiate-bonus-objects.json", function(data) {
  bonusesArr = [...data, ...bonusesArr];
});

function searchBonuses(regex) {
  var results = [];

  for (bonus of bonusesArr) {    
    if (regex.test(bonus.formatted_answer_1) || regex.test(bonus.formatted_answer_2) || regex.test(bonus.formatted_answer_3)) {
      results.push(bonus)
    } 
  }

  sortTournamentABC(results);
  return results
}

function sortTournamentABC(arr) {
  arr.sort(function(a, b){
    var x = a.tournament;
    var y = b.tournament;
    if (x < y) {return 1;}
    if (x > y) {return -1;}
    return 0;
  });
}

function resultElement(result, regex) {
  let tournament = result.tournament,
      round = result.round,
      leadin = result.formatted_leadin + ':',
      text1 = `1. ${result.formatted_text_1}`,
      text2 = `2. ${result.formatted_text_2}`,
      text3 = `3. ${result.formatted_text_3}`,
      answer1 = highlightMatches(result.formatted_answer_1, regex),
      answer2 = highlightMatches(result.formatted_answer_2, regex),
      answer3 = highlightMatches(result.formatted_answer_3, regex);

  let element = `<div class="search-result">
                   <div class="search-result-tournament">
                     <strong>${tournament}</strong>&nbsp;&nbsp;||&nbsp;&nbsp;${round}
                   </div>
                   <div class="search-result-leadin">${leadin}</div>
                   <hr class="leadin-hr">
                   <div class="search-result-question">${text1}</div>
                   <div class="search-result-answer">ANSWER: ${answer1}</div>
                   <hr class="light-hr">
                   <div class="search-result-question">${text2}</div>
                   <div class="search-result-answer">ANSWER: ${answer2}</div>
                   <hr class="light-hr">
                   <div class="search-result-question">${text3}</div>
                   <div class="search-result-answer">ANSWER: ${answer3}</div>
                 </div>`;
                 
  return element
}

function highlightMatches(str, regex) {
  return str.replace(regex, (match) => {
    return `<span class="highlighted">${match}</span>`
  })
}

function resetResults() {
  $("#question-results").html("");
  if ($(".results-container").is(":hidden")) {
    $(".results-container").show()
  };
  $("#search").blur();
  window.location.hash = ""
}

function run() {
  let search = $("#search").val();
  if (search.length < 3) {
    alert("You probably don't want to query that...\nLike, do you expect me to display every question in the DB?");
    return
  } 

  resetResults();

  let regex = new RegExp(`${search}`, 'ig');
  let results = searchBonuses(regex); 
  $("#question-results-length").text(`${results.length} bonuses found`);

  results.forEach(result => {
    let element = resultElement(result, regex);
    $("#question-results").append(element)
  })
}

$("#query").on("submit", () => {
  run()
})