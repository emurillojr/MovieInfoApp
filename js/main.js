$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText) {
  // OMDB API
  axios.get('http://www.omdbapi.com?s=' + searchText + '&apikey=6fe066fc').then((response) => {
    console.log(response);
    let movies = response.data.Search;
    let output = '';
    $.each(movies, (index, movie) => {
      output += '<div class="col-md-3">';
      output += '<div class="well text-center">';
      if (movie.Poster === "N/A") {
        output += `<img src="http://reelcinemas.ae/Images/Movies/not-found/no-poster.jpg">`;
      } else {
        output += `<img src="${movie.Poster}">`;
      }
      output += `<h5>${movie.Title}</h5>`;
      output += `<a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>`;
      output += '</div>';
      output += '</div>';
    });

    $('#movies').html(output);
  }).catch((err) => {
    console.log(err);
  });
}

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie() {
  // OMDB API
  let movieId = sessionStorage.getItem('movieId');
  axios.get('http://www.omdbapi.com?i=' + movieId + '&apikey=6fe066fc').then((response) => {
    console.log(response);
    let movie = response.data;

    let output = `
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

    $('#movie').html(output);
  }).catch((err) => {
    console.log(err);
  });
}

function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}

// YOUTUBE API
$(function() {
  $('#search').on('submit', (e) => {
    e.preventDefault();
    // prepare the request
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodeURIComponent($("#searchText2").val()).replace(/%20/g, "+"),
      maxResults: 3,
      order: "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    });
    // execute the request
    request.execute(function(response) {
      var results = response.result;
      $("#results").html("");
      $.each(results.items, function(index, item) {
        $.get("tpl/item.html", function(data) {
          $("#results").append(tplawesome(data, [
            {
              "title": item.snippet.title,
              "videoid": item.id.videoId
            }
          ]));
        });
      });
      resetVideoHeight();
    });
  });

  $(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
  $(".video").css("height", $("#results").width() * 9 / 16);
}

// YOUTUBE API
function init() {
  gapi.client.setApiKey("AIzaSyCxvOkQjAP2FwtziO0XIMz7dxsJZgOswVU");
  gapi.client.load("youtube", "v3", function() {
    // youtube api is ready
  });
}
