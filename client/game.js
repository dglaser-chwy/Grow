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
  player.x = 25;
  resetWalls();
  createWalls();
  }
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

var enemy = svg.append('polygon')  
  .attr('stroke', 'red')
  .attr('stroke-width', 2)
  //0, 30 0, 0 40, 15
  .attr('points', "0, 30 0, 0 -40, 15");

_.extend(enemy, {  
  x: 975,
  y: 250,
  angle: 0,
  _speed: 4
});

enemy.attr('transform', function() {  
  return 'translate(' + enemy.x + ',' + enemy.y + ')';
});

///////////////////////////////////////////////
//WALLS

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var createWalls = function(){
  var enemies = new Array(9);
  d3.select("svg")
    .selectAll("enemy")
    .data(enemies)
    .enter()
    .append("svg:rect")
    .attr("class", "enemy")
    .attr("x", function() { return getRandomArbitrary(150, 800); })
    .attr("y", function() { return getRandomArbitrary(-10, 300); })
    .attr("width", function() { return getRandomArbitrary(30, 200); })
    .attr("height", function() { return getRandomArbitrary(30, 200); })
    .attr({
      "fill" : "white", 
      "stroke" : "white", 
      "stroke-width" : "5",
    });
};

var resetWalls = function() {
  svg.selectAll("rect").remove();
};

createWalls();


