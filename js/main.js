

const width = 1566;
const height = 1011;

const svg = d3.select('#chart')
    .select('svg')
    .attr('viewBox', '0 0 1566 1011')
    .attr('width', '100%')
    .attr('height', '100%'); 


//Create a radial gradient
var defs = svg.append("defs");
defs.append("radialGradient")
  .attr("id", "sun-gradient")         
  .selectAll("stop")
  .data([
      {offset: "0%", color: "red"},
      {offset: "40%", color: "red"},
      {offset: "50%", color: "#00000087"},
      {offset: "100%", color: "#ff000087"}
    ])
  .enter().append("stop")
  .attr("offset", function(d) { return d.offset; })
  .attr("stop-color", function(d) { return d.color; });

const g = svg.append('g'); 

function gridData(xVal, yVal, S) {
    var data = new Array();
    var xpos = xVal; 
    var ypos = yVal;
    var width = 20;
    var height = 25;
    var sek = S;

    var original = Array.from({length: S+40}, (_, i) => i + S);
    var copy = [].concat(original);
    copy.sort(function(){  return 0.5 - Math.random();  });
  
  // iterate for rows	
  for (var row = 0; row < 5; row++) {		
    // iterate for cells/columns inside rows
  for (var column = 0; column < 8; column++) {
      data.push({
        x: xpos,
        y: ypos,
        width: width,
        height: height,
        second: copy[sek]       
        })
        // increment the x position. I.e. move it over by 50 (width variable)
        xpos += width;
        sek = sek + 1
      }
      // reset the x position after a row is complete
      xpos = xVal;
      // increment the y position for the next row. Move it down 50 (height variable)
      ypos += height;	
    }
    return data;
  }

  var gridData1 = gridData(640, 300, 1);
  var gridData2 = gridData(600, 550, 6);
  var gridData3 = gridData(500, 400, 11);  
  var gridData = gridData1.concat(gridData2).concat(gridData3);
  
d3.csv('data.csv').then(function(points){
  points.forEach(function(d, i){    
    step = 1;
    
    if(i <= 60){             
      d.x = randn_bm(400, 950, step);
      d.y = Math.floor(Math.random() * (800 - 200)) + 200;
    }             
    else {
      d.x = Math.floor(Math.random() * (900 - 450)) + 450;
      d.y = Math.floor(Math.random() * (850 - 200)) + 200;
    }
     
    d.sek = +d.sek
  })
  
  var mydata = points.filter(function(d){ return d.figure === 'circle'});
  
  d3.select("#play").on("click", function(){
    console.log("play");
    drawVertexSet(mydata);

    d3.select(this).style("pointer-events", "none").style("opacity", 0.2);
    //.attr('disabled', true)
  })
}) 

var mute = false;




function drawVertexSet(pointSet) { 
    var audio1 = new Audio('sounds/122mm incoming 16 in a minute.mp3');
    var audio2 = new Audio('sounds/122mm incoming 8 in a minute.mp3');
    var audio3 = new Audio('sounds/122mm incoming 4 in a minute.mp3');
    var audio4 = new Audio('sounds/smerch IN.mp3');

    function playAudio(){
        audio1.play(); 
        audio2.play(); 
        audio3.play(); 
        audio4.play(); 
    }

    function muteAudio(){
        audio1.muted = true;  
        audio2.muted = true; 
        audio3.muted = true; 
        audio4.muted = true; 
    }

    function unMuteAudio(){
        audio1.muted = false;  
        audio2.muted = false; 
        audio3.muted = false; 
        audio4.muted = false; 
    }
    
    d3.select("#mute").on("click", function(){
        if(mute === false){
            muteAudio();
            d3.select(this).style("opacity", 0.2)
        } else {
            unMuteAudio()
            d3.select(this).style("opacity", 1)
        }
        mute = !mute;
    });
    
  var grad = 0;
  var type1 = 0;
  var type2 = 0;
  var type3 = 0;
  
  setTimeout(function() { 
    playAudio()
  }, 1000)  

  setTimeout(function() {             
    audio4.muted = true; 
  }, 34000)  
   

  g.selectAll('circle.shelling')
    .data(pointSet)
    .join('circle')
    .attr('class', 'shelling')
    .attr('cx', 2000)
    .attr('cy', 500)
    .attr('r', 6)
    .style("fill", "red")    
    .on('click', function (d){
      console.log(d.x, d.y)
    })           
    .transition()              
    .duration(1000)              
      .delay((d, i) => d.sek * 1000)              
      .attr('cx', function(d){ return d.x })
      .attr('cy', function(d){ return d.y })
      .on("end", function(d){
        d3.select(this).style("fill", "url(#sun-gradient)").attr('r', 12);                
        if(d.type === '1'){
          type1 = type1 + 1
          d3.select('#minute-4').html(type1)
        } else if (d.type === '2'){
          type2 = type2 + 1
          d3.select('#minute-8').html(type2)
        } else if (d.type === '3'){
          type3 = type3 + 1
          d3.select('#minute-16').html(type3)
        }
      });      
                
                
    svg.selectAll(".square")
        .data(gridData)
        .join('rect')
        .attr("class","square")
        .attr('x', 10000)
        .attr('y', 500)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", function(d) { return d.width  })
        .attr("height", function(d) { return d.height; })  
        .style("fill", "red")	
        .style('opacity', 0.4) 
        .transition()              
        .duration(1500) 
        .delay((d, i) => (d.second * 750)) 
        .attr("x", function(d) { return d.x + (Math.floor(Math.random() * 11) - 5);  })
        .attr("y", function(d) { return d.y + (Math.floor(Math.random() * 11) - 5); })
        .on("end", function(d){
                d3.select(this)
                .attr("rx", 6)
                .attr("ry", 6);  
                grad = grad + 1;
                d3.select('#grad').text(grad)
                
            });

  /* timer */
  var seconds = 0;
  var timer;
  function startTimer() {      
    if (seconds < 10 ) { 
      d3.select("#timer span").html("0"+ seconds.toString());
      seconds++;
    } else if(seconds >= 10 && seconds <= 60){
      d3.select("#timer span").html(seconds);
      seconds++;
    } else {
      clearInterval(timer);     
      d3.select('#play').style("opacity", 1).style("pointer-events", "all");   
      d3.select("#timer span").html('00');
    }
  }

  if(!timer) {
    timer = window.setInterval(function() { 
       startTimer();
    }, 1000); 
  }              
} 



//gausan distribution from here: https://jsfiddle.net/2uc346hp/
const randn_bm = (min, max, skew) => {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); 
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5;
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); 
    num = Math.pow(num, skew); 
    
    num *= max - min; 
    num += min; 
    return num;
}