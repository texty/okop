const width = 1566;
const height = 1011;

const svg = d3.select('#chart')
    .select('svg')
    .attr('viewBox', '0 0 1566 1011')
    .attr('width', '100%')
    .attr('height', '100%'); 


//тимчасовий Х для налаштування    
var xScale = d3.scaleLinear()
    .domain([0,1566])
    .range([0,1566])

var xAxis = d3.axisBottom()
    .scale(xScale);

//svg.append("g").call(xAxis);


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

var gridData1 = gridData(640, 300, 1);
var gridData2 = gridData(600, 550, 6);
var gridData3 = gridData(500, 400, 11);

var gridData = gridData1.concat(gridData2).concat(gridData3);

var randomNormalArray_x = Float64Array.from({length: 106}, d3.randomNormal(0.7, 0.1), [0.5, 0.8]);

d3.csv('data.csv').then(function(points){
    points.forEach(function(d, i){
        d.x = randomNormalArray_x[i] * 1000;         
        d.y = Math.floor(Math.random() * (850 - 200)) + 200;     
        d.sek = +d.sek
  })

d3.select("#play").on("click", function(){

    drawVertexSet(points);
    
    d3.select(this)
        .style("pointer-events", "none")
        .style("opacity", 0.2);   
  })
}) 

var mute = false;

function drawVertexSet(pointSet) { 
    var seconds = 0;
    var timer;

    var gradCount = 0;
    var perMinute4Count = 0;
    var perMinute8Count = 0;
    var perMinute16Count = 0;

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
        if(gradCount < 119){
            audio4.muted = false; 
        }
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
    
  // одна секунда затримки для transition duration  
  setTimeout(function() { playAudio() }, 1000)  
  

  g.selectAll('circle.shelling')
    .data(pointSet)
    .join('circle')
    .attr('class', 'shelling')
    .attr('cx', 2000)
    .attr('cy', 500)
    .attr('r', 6)
    .style("fill", "red")              
    .transition()              
    .duration(1000)              
      .delay((d, i) => d.sek * 1000)              
      .attr('cx', function(d){ return d.x })
      .attr('cy', function(d){ return d.y })
      .on("end", function(d){
          
        d3.select(this).style("fill", "url(#sun-gradient)").attr('r', 12); 

        if(d.type === '1'){
            perMinute4Count = perMinute4Count + 1
            d3.select('#minute-4').html(perMinute4Count)
        } else if (d.type === '2'){
            perMinute8Count = perMinute8Count + 1
            d3.select('#minute-8').html(perMinute8Count)
        } else if (d.type === '3'){
            perMinute16Count = perMinute16Count + 1
            d3.select('#minute-16').html(perMinute16Count)
        }
      });      
                
                
    svg.selectAll(".square")
        .data(gridData)
        .join('rect')
        .attr("class","square")
        .attr('x', 10000)
        .attr('y', 500)        
        .attr("width", function(d) { return d.width  })
        .attr("height", function(d) { return d.height; })  
        .style("fill", "red")	
        .style('opacity', 0.4) 
        .transition()              
        .duration(1500) 
        .delay((d, i) => (d.second * 1000)) 
        .attr("x", function(d) { return d.x + (Math.floor(Math.random() * 11) - 5);  })
        .attr("y", function(d) { return d.y + (Math.floor(Math.random() * 11) - 5); })
        .on("end", function(){
            if(gradCount === 119){ 
                audio4.muted = true;  
            }
            d3.select(this).attr("rx", 6).attr("ry", 6); 

            gradCount = gradCount + 1;
            d3.select('#grad').text(gradCount)
                
        });

  /* timer */
  
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


function gridData(xVal, yVal, startSecond) {
    var data = new Array();
    var xpos = xVal; 
    var ypos = yVal;
    var width = 20;
    var height = 25;
    var iteration = 1;

    let min = startSecond;
    let max = startSecond + 20;
    let interval = 0.5;

    const length = (max - min) / interval + 1;
    var gradArray = Array.from({ length }, (_, i) => min + i * interval);    
    gradArray.sort(function(){  return 0.5 - Math.random();  });
    
  
  // iterate for rows	
  for (var row = 0; row < 5; row++) {		
    // iterate for cells/columns inside rows
  for (var column = 0; column < 8; column++) {
      data.push({
        x: xpos,
        y: ypos,
        width: width,
        height: height,
        second: gradArray[iteration]       
        })
        // increment the x position. I.e. move it over by 50 (width variable)
        xpos += width;
        iteration = iteration + 1
      }
      // reset the x position after a row is complete
      xpos = xVal;
      // increment the y position for the next row. Move it down 50 (height variable)
      ypos += height;	
    }
    return data;
  }
