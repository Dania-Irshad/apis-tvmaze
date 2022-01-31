/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // Make an ajax request to the searchShows api.
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  let arr = [];
  let shows = res.data;
  for (let i = 0; i < shows.length; i++) {
    arr.push({
      id: shows[i].show.id,
      name: shows[i].show.name,
      summary: shows[i].show.summary,
      image: shows[i].show.image !== null ? shows[i].show.image.medium : "https://tinyurl.com/tv-missing"
    });
  };
  return arr;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">${show.summary}</p>
            <a href="#" class="btn btn-primary" id="episodesBtn">Episodes</a>
          </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // get episodes from tvmaze
  let res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  let arr = [];
  let episodes = res.data;
  for (let i = 0; i < episodes.length; i++) {
    arr.push({
      id: episodes[i].id,
      name: episodes[i].name,
      season: episodes[i].season,
      number: episodes[i].number
    });
  };
  return arr;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name} (season ${episode.season}, episode ${episode.number})</li>`);
    $episodesList.append($item);
  }
  $("#episodes-area").show();
}

$("#shows-list").on("click", "#episodesBtn", async function displayEpisodes(evt) {
  let showID = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showID);
  populateEpisodes(episodes);
})