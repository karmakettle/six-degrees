
var app = {
  init: function(){
    app.actors = [];
    app.getActor(app.generateRandom(), true);
    app.getActor(app.generateRandom());
    // app.displayActorImage($('#start'), app.actors[0]);
  },

  generateRandom: function(){
    return Math.floor(Math.random() * 1000);
  },

  getActor: function(id, isInit){
    // if app is initializing, set a goal actor; else, add to actors array
    $.ajax({
      url: "http://api.themoviedb.org/3/person/" + id + "?api_key=b94d3520d22303948e683ac7f88387c7",
      accept: "application/json"
    }).done(function(data){
      if (isInit) { 
        app.goal = data;
        app.displayActorInfo($('.goal'), data);

      } else {
        app.actors.push(data);
        app.displayActorInfo($('#start'), data);
      }
    })
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
  }

};

$(document).ready(function(){
  $('input').keypress(function(e){
    if (e.keyCode === 13) {
      // get info:  whether it's actor or movie
    }
  });
});