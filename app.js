
var app = {
  init: function(){
    app.actors = [];
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
      app.actors.push(startActor);
      app.displayActorInfo($('#start'), startActor);
      app.goal = goalActor;
      app.displayActorInfo($('.goal'), goalActor);
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

  displayActorInfo: function(node, actor){
    // get image property from object and add to appropriate element
    var imagePath = "http://image.tmdb.org/t/p/original" + actor.profile_path;
    node.children('.img').css({
              'background-image': 'url(' + imagePath + ')',
              'background-size': 'cover',
              'background-repeat': 'no-repeat'
            });
    node.children('input').remove();
    node.append('<h2>' + actor.name + '</h2>');
  },

  displayMovieSearch: function(node, results){
    var dropdown = $('<ul class="active"></ul>');
    for ( var i = 0; i < results.length; i++ ) {
      var movie = results[i];
      dropdown.append('<li data-id="' + movie.id + '">' + movie.title + ', ' + movie.release_date + '</li>')
    }
    node.after(dropdown);
    $('li').on('click', app.selectMovie);
  },

  displayActorSearch: function(node, results){
    var dropdown = $('<ul class="active"></ul>');
    for ( var i = 0; i < results.length; i++ ) {
      var actor = results[i];
      dropdown.append('<li data-id="' + actor.id + '">' + actor.name + '</li>')
    }
    node.after(dropdown);
    $('li').on('click', app.selectActor);
  },

  selectActor: function(){
    var id = $(this).data('id');
    app.compareActor = id;
    // if there's already a compareMovie in existence, compare, remove the display box
    if ( app.compareMovie ) {
      // if the actor's name is in the movie's credits, 'solidify' the fields and remove disabled from the next ones
      if ( app.confirmConnection() ) {
        // if goalActor, winning sequence!
        // else
          // startActor = compareActor;
          // compareActor = undefined;
          // compareMovie = undefined;
          // remove .active class to remove dropdown
          // remove inputs and add h2s with names and photos
          // set background / highlight
      } else {
        // there's not a match, display error
        console.log("These actors are not in a movie together.")
      }
    }

    $('.active').remove();
  },

  selectMovie: function(){
    var id = $(this).data('id');
    app.compareMovie = id;
    // if there's already a compareActor in existence, compare
    if ( app.compareActor ) app.confirmConnection();
    // remove the display box
    $('.active').remove();
  },

  confirmConnection: function(){
    // get movie credits from compareMovie
    $.ajax({
      url: "http://api.themoviedb.org/3/movie/" + app.compareMovie + "/credits?api_key=b94d3520d22303948e683ac7f88387c7",
      accept: "application/json"
    }).done(function(results){
      var cast = results.cast.map(function(person){
        return person.name;
      });

      // if both actors' names are in the movie's credits
        //'solidify' the fields and remove disabled from the next ones
          // if goalActor, winning sequence!
          // else
            // startActor = compareActor;
            // compareActor = undefined;
            // compareMovie = undefined;
            // remove .active class to remove dropdown
            // remove inputs and add h2s with names and photos
            // set background / highlight
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
        console.log('hooray movie!');
        // get list of possible matches by searching tmdb and display options
        app.movieSearch($(this), guess);
      } else {
        app.actorSearch($(this), guess);
      }
    }
  });
});