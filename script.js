const searchInput = document.querySelector("#search-input");
const competitions = [...document.querySelectorAll(".competition")];
const resultCount = document.querySelector("#result-count");
const clearSearch = document.querySelector("#clear-search");
const emptyState = document.querySelector("#empty-state");
const emptyClear = document.querySelector("#empty-clear");

function filterCompetitions() {
  const terms = searchInput.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  let visibleCount = 0;

  competitions.forEach((competition) => {
    const searchableText = competition.dataset.search.toLocaleLowerCase();
    const isMatch = terms.every((term) => searchableText.includes(term));

    competition.hidden = !isMatch;
    visibleCount += Number(isMatch);
  });

  resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "competition" : "competitions"}`;
  clearSearch.hidden = terms.length === 0;
  emptyState.hidden = visibleCount !== 0;
}

function resetSearch() {
  searchInput.value = "";
  filterCompetitions();
  searchInput.focus();
}

searchInput.addEventListener("input", filterCompetitions);
clearSearch.addEventListener("click", resetSearch);
emptyClear.addEventListener("click", resetSearch);

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }

  if (event.key === "Escape" && document.activeElement === searchInput && searchInput.value) {
    resetSearch();
  }
});