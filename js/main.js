$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    console.log(searchText);
    getMovies(searchText);
    e.preventDefault(); // stop form from submitting to file
  });
});

function getMovies(searchText) {
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=2b8ee5f2fd65ec098a098c4dd33937e0&query=' + searchText)
  .then((response) => {

    let movies = response.data.results;
        console.log(movies);
        let output = '';
        $.each(movies, function(index, movie){
            output += '<div class="col-md-3">';
            output +=   '<div class="well text-center">';
            output +=        '<img onerror="handleMissingImg(this);" src="http://image.tmdb.org/t/p/w185/'+movie.poster_path+'">';
            output +=       '<h5>'+ movie.title+'</h5>';
            output +=       '<a onclick=movieSelected("'+ movie.id +' class="btn btn-primary" href="#")>Movie Details</a>';
            output +=   '</div>';
            output += '</div>';
        });

        $('#movies').html(output);

    })
    .catch(function (error) {
        console.log(error);
        console.log('something is going wrong');
    });
}﻿

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}


function getMovie() {
  let movieId = sessionStorage.getItem('movieId');
  axios.get('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=2b8ee5f2fd65ec098a098c4dd33937e0').then((response) => {
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
