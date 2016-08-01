//Builds the playing window
var svg = d3.select('.screen')  
  .append('svg')
  .attr('height', 500)
  .attr('width', 1000)
  .style({
    "background-color" : "black", 
    "border-color" : "rgb(255,255,255)",
    "border-style" : "solid",
    "border-width" : "5px",
  });
//////////////////////////////////////////////////
//PLAYER

var player = svg.append('polygon')
  .attr('class', 'player')  
  .attr('stroke', 'lightgreen')
  .attr('stroke-width', 2)
  .attr('points', "0, 30 0, 0 40, 15 ");

_.extend(player, {  
  x: 25,
  y: 250,
  angle: 0,
  _speed: 4
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

var moveTriangle = function() {

  var x = player.x;
  var y = player.y;

  if (keyPressed['Left']) {
    player.x = isInBounds(x - player._speed, 'width');
  }
  if (keyPressed['Up']) {
    player.y = isInBounds(y - player._speed, 'height');
  }
  if (keyPressed['Right']) {
    player.x = isInBounds(x + player._speed, 'width');
  }
  if (keyPressed['Down']) {
    player.y = isInBounds(y + player._speed, 'height');
  }
  player.move(x, y);

  //COMPLETE CONDITION
  if (player.x > 950) {
    reset();
  }
};

var reset = function() {
  player.x = 25;
  resetWalls();
  createWalls();
};


var isInBounds = function(n, dimension) {  
  if (n < 0) {
    return 0;
  } else if (n > svg.attr(dimension) - 40) {
    return svg.attr(dimension) - 40;
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
    return 'rotate(' + [this.angle, this.x + 20, this.y + 15].join() + ')' +
      'translate(' + [this.x, this.y].join() + ')';
  }.bind(this));
};

d3.timer(moveTriangle);

///////////////////////////////////////////////
//FINISH LINE

var finish = svg.append('svg:rect')  
  .attr({
    'fill': 'lightgreen',
    'x' : 980,
    'y' : 0,
    'width' : 20,
    'height' : 500
  });

///////////////////////////////////////////////
//WALLS

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var createWalls = function(){
  var walls = new Array(15);
  d3.select("svg")
    .selectAll("wall")
    .data(walls)
    .enter()
    .append("svg:circle")
    .attr("class", "wall")
    .attr("cx", function() { return getRandomArbitrary(150, 900); })
    .attr("cy", function() { return getRandomArbitrary(-100, 600); })
    .attr("r", function() { return getRandomArbitrary(30, 90); })
    .attr({
      "fill" : "white", 
      "stroke" : "white", 
      "stroke-width" : "5",
    });
};

var resetWalls = function() {
  svg.selectAll(".wall").remove();
};

createWalls();

//////////////////////////////////////////////////
//LAZER

var createLazer = function() {
  var lazer = svg.append('svg:rect')  
    .attr("class", "lazer")
    .attr({
      'fill': 'red',
      'x' : 0,
      'y' : 0,
      'width' : 1000,
      'height' : 10
    });
};

var resetLazer = function() {
  svg.selectAll(".lazer").remove();
};

var moveLazer = function() {
  d3.select('svg')
    .selectAll('.lazer')
    .transition()
    .duration(3000)
    .attr("y", 490)
    .transition()
    .duration(3000)
    .attr("y", 0);
};

//if lazer rect is touching wall rect, set lazer width to as far as right edge of wall
//else lazer width is 1000

var wallCollision = false;

createLazer();
moveLazer();
setInterval(moveLazer, 6000);

///////////////////////////////////////////
//WALL COLLISION

var collison = function() {

  //enemyCollision
  var walls = d3.selectAll('.wall')[0];
  for (var i = 0; i < walls.length; i++) {
    var wall = walls[i];
    console.log(wall);
    var wallR = wall.r.baseVal.value;
    var wallX = player.x - wall.cx.baseVal.value;
    var wallY = player.y - wall.cy.baseVal.value;
    var wallDistance = Math.sqrt(wallX*wallX + wallY*wallY);
    if (wallDistance < wallR) {
      console.log('COLLISON');
      player.x = 25;
    }
  }
};


setInterval(collison, 200);



