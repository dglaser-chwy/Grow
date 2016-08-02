////////////////////////////////////////////////////////
//AUDIO
window.onload = function() {
    var backgroundAudio=document.getElementById("song");
    backgroundAudio.volume=0.02;
    var rainAudio=document.getElementById("rain");
    rainAudio.volume=1.0;
};

var chime = new Audio('assets/chime.wav');

//////////////////////////////////////////////////////
///SCORE COUNTER START

var level = d3.select('.level').text();
var drops = d3.select('.drops').text();

//////////////////////////////////////////////////
//GAME BOARD
var svg = d3.select('.screen')  
  .append('svg')
  .attr('height', 500)
  .attr('width', 500)
  .style({
    "background-repeat" : "no-repeat",
    "background-color" : "rgb(0, 0, 136)", 
    "background-position" : "bottom",
    "border-color" : "rgb(255, 255, 255)",
    "border-style" : "solid",
    "border-width" : "5px",
  });
//////////////////////////////////////////////////
//PLAYER

var player = svg.append('circle') 
  .attr('class', 'player') 
  .attr('stroke', 'lightblue')
  .attr('fill', 'lightblue')
  .attr('stroke-width', 2)
  .attr('r', 5)
  .attr('x', 250)
  .attr('y', 10);

_.extend(player, {  
  x: 250,
  y: 10,
  _speed: 3
});

player.attr('transform', function() {  
  return 'translate(' + player.x + ',' + player.y + ')';
});

var keyPressed = {};

d3.select('body')  
  .on('keydown', function() {
    keyPressed[d3.event.keyIdentifier] = true;
  })
  .on('keyup', function() {
    keyPressed[d3.event.keyIdentifier] = false;
  });

var movePlayer = function() {

  var x = player.x;
  var y = player.y;

  if (keyPressed['Left']) {
    player.x = isInBounds(x - player._speed, 'width');
  }
  // if (keyPressed['Up']) {
  //   player.y = isInBounds(y - player._speed, 'height');
  // }
  if (keyPressed['Right']) {
    player.x = isInBounds(x + player._speed, 'width');
  }
  if (keyPressed['Down']) {
    player.y = isInBounds(y + player._speed, 'height');
  }
  player.move(x, y);

  //PLAYER REACHES GROUND
  if (player.y > 490) {
    player.y = 10;
    resetClouds();
    createClouds(cloudNumber);
    createPlant(player.x);
    plantHeight = plantHeight - difficulty;
    svg.style({
      "background-image" : "none",
    });
  }

  //LEVEL DONE
  if (plantHeight < -difficulty) {
    plantHeight = 480;
    difficulty = difficulty * 0.8;
    level++;
    d3.select('.level').text(level);
    drops++;
    d3.select('.drops').text(drops);
    resetPlants();
    resetClouds();
    cloudNumber = cloudNumber + 1;
    createClouds(cloudNumber);
    chime.play();
    svg.style({
        "background-image" : "url('assets/rainbow.gif')",
      });
  }
};

var isInBounds = function(n, dimension) {  
  if (n < 0) {
    return 0;
  } else if (n > svg.attr(dimension)) {
    return svg.attr(dimension);
  } else {
    return n;
  }
};

player.move = function(x, y) {  
  var dx = this.x - x;
  var dy = this.y - y;
  if (dx !== 0 || dy !== 0) {
    this.angle = 360 * (Math.atan2(dy, dx) / (Math.PI * 2));
  }
  player.attr('transform', function() {
    return 'translate(' + [this.x, this.y].join() + ')';
  }.bind(this));
};

d3.timer(movePlayer);  

///////////////////////////////////////////////
//FINISH LINE

var finish = svg.append('svg:rect')  
  .attr({
    'fill': 'lightgreen',
    'x' : 0,
    'y' : 490,
    'width' : 500,
    'height' : 10
  });

///////////////////////////////////////////////
//CLOUDS
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var createClouds = function(n){
  var clouds = new Array(n);
  d3.select("svg")
    .selectAll("cloud")
    .data(clouds)
    .enter()
    .append("svg:circle")
    .attr("class", "cloud")
    .attr("cx", function() { return getRandomArbitrary(-10, 510); })
    .attr("cy", function() { return getRandomArbitrary(100, 400); })
    .attr("r", function() { return getRandomArbitrary(20, 70); })
    .attr({
      "fill" : "white", 
      "stroke" : "white", 
      "stroke-width" : "5",
    });
};

var resetClouds = function() {
  svg.selectAll(".cloud").remove();
};

cloudNumber = 5;
createClouds(cloudNumber);


//////////////////////////////////////////////////
//PLANT

var plantHeight = 480;
var difficulty = 80;

var createPlant = function(x) {
  var plant = svg.append('svg:rect')  
    .attr("class", "plant")
    .attr({
      'fill': 'green',
      'x' : x,
      'y' : 500,
      'width' : 10,
      'height' : 500
    })
    .transition()
    .duration(3000)
    .attr('y', plantHeight);
    ground();
};

var resetPlants = function() {
  svg.selectAll(".plant").remove();
};

///////////////////////////////////////////
//CLOUD COLLISION

var collison = function() {

  //enemyCollision
  var clouds = d3.selectAll('.cloud')[0];
  for (var i = 0; i < clouds.length; i++) {
    var cloud = clouds[i];
    var cloudR = cloud.r.baseVal.value;
    var cloudX = player.x - cloud.cx.baseVal.value;
    var cloudY = player.y - cloud.cy.baseVal.value;
    var wallDistance = Math.sqrt(cloudX*cloudX + cloudY*cloudY);
    if (wallDistance - 5 < cloudR) {
      player.y = 25;
      resetClouds();
      createClouds(cloudNumber);
      drops--;
      
      //GAME OVER
      if (drops <= 0) {
        drops = 0;

        svg.selectAll(".player").remove();

        d3.select('.screen').remove();
  
        d3.select('.retryDiv')  
        .append('a')
        .text("Retry")
        .attr("class", "retry")
        .attr("href", "https://jazzandrain.herokuapp.com")
        .style({
          "color" : 'lightblue',
          "float" : 'left',
          "margin-left": "44.5%",
          "margin-top" : "15px",
          "font-size" : "30px"
        });

        d3.select('.retry')  
        .append('a')
        .text("Portfolio")
        .attr("href", "http://www.danielmglaser.com/")
        .attr("class", "portfolio")
        .style({
          "float" : 'left',
          "margin-left": "25.5%",
          "font-size" : "18px",
          "margin-top" : "30px",
        });
        
      }
      d3.select('.drops').text(drops);
    }
  }
};


setInterval(collison, 200);

//////////////////////////////////////////
///GROUND OVERLAY

var ground = function() {
  svg.append('svg:rect')  
  .attr({
    'fill': 'lightgreen',
    'x' : 0,
    'y' : 490,
    'width' : 500,
    'height' : 10
  });
};
