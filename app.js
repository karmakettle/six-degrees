
var app = {
  init: function(){
    app.generateRandom();
  },

  generateRandom: function(){
    // if app is initializing, set a goal actor; else, add to actors array
    $.ajax({
      url: "http://api.themoviedb.org/3/person/popular?api_key=b94d3520d22303948e683ac7f88387c7",
      accept: "application/json"
    }).done(function(personList){
      var startActor = personList.results[Math.floor(Math.random() * personList.results.length)];
      var goalActor = personList.results[Math.floor(Math.random() * personList.results.length)];
      app.startActor = [startActor.name, startActor.profile_path];
      app.goalActor = [goalActor.name, goalActor.profile_path];
      app.displayActorInfo($('#start'), app.startActor[0], app.startActor[1]);
      app.displayActorInfo($('.goal'), app.goalActor[0], app.goalActor[1]);
    });
  },

  movieSearch: function(node, guess){
    $.ajax({
      url: "http://api.themoviedb.org/3/search/movie?api_key=b94d3520d22303948e683ac7f88387c7&query=" + guess,
      accept: "application/json"
    }).done(function(results){
      app.displayMovieSearch(node, results.results);
    });
  },

  actorSearch: function(node, guess){
    $.ajax({
      url: "http://api.themoviedb.org/3/search/person?api_key=b94d3520d22303948e683ac7f88387c7&query=" + guess,
      accept: "application/json"
    }).done(function(results){
      app.displayActorSearch(node, results.results);
    });
  },

  displayActorInfo: function(node, nameOrTitle, path){
    // get image property from object and add to appropriate element
    var imagePath = "http://image.tmdb.org/t/p/original" + path;
    node.children('.img').css({
              'background-image': 'url(' + imagePath + ')',
              'background-size': 'cover',
              'background-repeat': 'no-repeat'
            });
    node.children('input').remove();
    node.append('<h2>' + nameOrTitle + '</h2>');
  },

  displayMovieSearch: function(node, results){
    var dropdown = $('<ul class="active"></ul>');
    for ( var i = 0; i < results.length; i++ ) {
      var movie = results[i];
      dropdown.append('<li data-id="' + movie.id + '" data-title="' + movie.title + '" data-image="' + 
        movie.poster_path + '">' + movie.title + ', ' + movie.release_date + '</li>')
    }
    node.after(dropdown);
    $('li').on('click', app.selectMovie);
  },

  displayActorSearch: function(node, results){
    var dropdown = $('<ul class="active"></ul>');
    for ( var i = 0; i < results.length; i++ ) {
      var actor = results[i];
      dropdown.append('<li data-name="' + actor.name + '" data-image="' + actor.profile_path + '">' + actor.name + '</li>')
    }
    node.after(dropdown);
    $('li').on('click', app.selectActor);
  },

  selectActor: function(){
    var name = $(this).data('name');
    var image = $(this).data('image');
    app.compareActor = [name, image];
    // if there's already a compareMovie in existence, compare, remove the display box
    if ( app.compareMovie ) app.confirmConnection();
    // remove the display box
    $('.active').remove();
  },

  selectMovie: function(){
    var id = $(this).data('id');
    var title = $(this).data('title');
    var image = $(this).data('image');
    debugger;
    app.compareMovie = [id, title, image];
    // if there's already a compareActor in existence, compare
    if ( app.compareActor ) app.confirmConnection();
    // remove the display box
    $('.active').remove();
  },

  confirmConnection: function(){
    // get movie credits from compareMovie
    $.ajax({
      url: "http://api.themoviedb.org/3/movie/" + app.compareMovie[0] + "/credits?api_key=b94d3520d22303948e683ac7f88387c7",
      accept: "application/json"
    }).done(function(results){
      var cast = results.cast.map(function(person){
        return person.name;
      });

      // if both actors' names are in the movie's credits
      if ( cast.indexOf(app.compareActor[0]) !== -1 && cast.indexOf(app.startActor[0]) !== -1 ) {
        //'solidify' the fields and remove disabled from the next ones
        app.displayActorInfo($('.compare-actor'), app.compareActor[0], app.compareActor[1]);
        app.displayActorInfo($('.compare-movie'), app.compareMovie[1], app.compareMovie[2]);
          // if goalActor, winning sequence!
          // else
            // startActor = compareActor;
            // compareActor = undefined;
            // compareMovie = undefined;
            // remove .active class to remove dropdown
            // remove inputs and add h2s with names and photos
            // set background / highlight
      } else {
        console.log("These actors are not in a movie together, yo");
      }
    });
  }

};

$(document).ready(function(){
  $('input').keypress(function(e){
    if ( e.keyCode === 13 ) {
      // get info:  whether it's actor or movie
      var guess = $(this).val();
      // if this parent's class is a movie
      if ( $(this).parent().hasClass('movie') ) {
        // get list of possible matches by searching tmdb and display options
        app.movieSearch($(this), guess);
      } else {
        app.actorSearch($(this), guess);
      }
    }
  });
});