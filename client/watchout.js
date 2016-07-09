var collisonCounter = 0;
var score = 0;
var high = d3.select(".highscore span").text();
var audio = new Audio('hit.wav');
// start slingin' some d3 here.

var svg = d3.select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500)
  .style({
  	"background-image" : "url('background.gif')", 
  	"border-color" : "rgb(0,255,0)",
  	"border-style" : "solid",
  	"border-width" : "5px",
  	"margin" : "auto" });

var drag = d3.behavior.drag().on("drag", function() {
  if ( d3.event.x > 10 && d3.event.x < 490 && d3.event.y > 10 && d3.event.y < 490) {
    player.attr("cx", d3.event.x).attr("cy", d3.event.y);
  }
});

var createEnemy = function(){
  var enemies = new Array(20);
  d3.select("svg")
    .selectAll("enemy")
    .data(enemies)
    .enter()
    .append("svg:circle")
    .attr("class", "enemy")
    .attr("cx", function() { return Math.floor(Math.random() * 500); })
    .attr("cy", function() { return Math.floor(Math.random() * 500); })
    .attr({
      "r": 15,
      "fill" : "black", 
      "stroke" : "white", 
      "stroke-width" : "2",
    });
}

createEnemy();

var moveEnemy = function() {
  d3.select('svg')
    .selectAll('.enemy')
    .transition()
    .duration(3000)
    .attr("cx", function() { return Math.floor(Math.random() * 500); })
    .attr("cy", function() { return Math.floor(Math.random() * 500); });
};

var player = d3.select('svg')
   .append('svg:circle')
   .attr('class', 'player')
   .attr({
     'cx': 250,
     'cy': 250,
     'r': 10,
     "fill" : "black", 
     "stroke" : "rgb(0,255,0)", 
     "stroke-width" : "2",
   }).call(drag);

//Check position of player

var currentScore = function() {
  score++;
  d3.select(".current span").text(score);
};

var collison = function() {
  var enemies = d3.selectAll('.enemy')[0];
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    var playerPos = d3.select('.player')[0][0];
    var x = playerPos.cx.baseVal.value - enemy.cx.baseVal.value;
    var y = playerPos.cy.baseVal.value - enemy.cy.baseVal.value;
    var distance = Math.sqrt(x*x + y*y);
    if (distance < 25) {
      player.attr("stroke", 'red');
      if (score > high) {
        audio.play();
        d3.select(".highscore span").text(score);
      } 
      score = -1;
      collisonCounter++;
      d3.select(".collisions span").text(collisonCounter);
    }
  }

};

var resetColor = function() {
	player.attr("stroke", 'rgb(0,255,0)');
}

setInterval(resetColor, 400)
setInterval(collison, 200);
setInterval(currentScore, 1000);
setInterval(moveEnemy, 3000);