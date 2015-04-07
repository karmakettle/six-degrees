
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

  getActor: function(id, isInit){
    $.ajax({
      url: "http://api.themoviedb.org/3/person/" + id + "?api_key=b94d3520d22303948e683ac7f88387c7",
      accept: "application/json"
    }).done(function(data){
    })
  },

  movieSearch: function(node, guess){
    $.ajax({
      url: "http://api.themoviedb.org/3/search/movie?api_key=b94d3520d22303948e683ac7f88387c7&query=" + guess,
      accept: "application/json"
    }).done(function(results){
      app.displayMovieSearch(node, results.results);
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
    console.log(results);
    var resultHtml = "";
    for ( var i = 0; i < results.length; i++ ) {
      var movie = results[i];
      resultHtml += "<li>" + movie.title + ", " + movie.release_date + "</li>";
    }
    node.after('<div class="active">' + resultHtml + '</div>');
  }

};

$(document).ready(function(){
  $('input').keypress(function(e){
    if (e.keyCode === 13) {
      // get info:  whether it's actor or movie
      var guess = $(this).val();
      // if this parent's class is a movie
      if ( $(this).parent().hasClass('movie') ) {
        console.log('hooray movie!');
        // get list of possible matches by searching tmdb
        app.movieSearch($(this), guess);
        // display list of options underneath input
      }
      // if it's a movie, check last actor?
    }
  });
});