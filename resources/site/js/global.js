// paul irish wankyness
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// GetSchwifty.js
var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  img = new Image(),
  rowPieces = 10,
  columnPieces = 10,
  totalPieces = rowPieces*columnPieces,
  workingPiece = 0,
  blocks = [],
  activeBlocks = [],
  updateAndRender = true,
  drawRequestID,
  drawTimeout;

img.src = "resources/site/images/rick-and-morty-get-schwifty.jpg";

//   // set height & width
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

img.onload = function(){

  function theLoop(){
    var loopCount = 0;
    for(var colCount=0;colCount<columnPieces;colCount++){
      for(var rowCount=0;rowCount<rowPieces;rowCount++){
        blocks.push(
          new Block(
            (canvas.width/rowPieces), // w
            (img.width/rowPieces), // sWidth
            (canvas.height/columnPieces), // h
            (img.height/columnPieces), // sHeight
            ((img.width/rowPieces)*rowCount), //sx
            ((canvas.width/rowPieces)*rowCount), //x
            (canvas.width/rowPieces), // fromX
            ((canvas.width/rowPieces)*rowCount), // toX
            ((img.height/columnPieces)*colCount), // sy
            ((canvas.height/columnPieces)*colCount), // y
            (canvas.height/columnPieces), // fromY
            ((canvas.height/columnPieces)*colCount), // toY
            loopCount // Loop count, starting on 0
          )
        );
        loopCount++;
      }
    }

  }

  theLoop();

  function Block(w, sWidth, h, sHeight, sx, x, fromX, toX, sy, y, fromY, toY, loopCount){
    this.w = w;
    this.sWidth = sWidth;
    this.h = h;
    this.sHeight = sHeight;
    this.sx = sx;
    this.x = -x;
    this.fromX = fromX;
    this.toX = toX;
    this.sy = sy;
    this.y = -y;
    this.fromY = fromY;
    this.toY = toY;
    this.i = loopCount;
  }

  Block.prototype.update = function(){
    // so if the increment is NOT enlarged by "1" the position could final up being offset
    if(this.y < this.toY){
        this.y+=40;
    }
    //reset the y pos
    if(this.y > this.toY){
      this.y = this.toY;
    }
    // so if the increment is NOT enlarged by "1" the position could final up being offset
    if(this.x < this.toX){
      this.x+=40;
    }
    // reset the x pos
    if(this.x > this.toX){
      this.x = this.toX;
    }
  };

  Block.prototype.render = function(){
    context.drawImage(img, this.sx, this.sy, this.sWidth, this.sHeight, this.x, this.y, this.w, this.h);
    //console.log(img);
  };

    //draw the screen
    function draw() {
        drawTimeout = setTimeout(function() {
            drawRequestID = window.requestAnimationFrame(draw);

            // This stops active blocks from growing larger than intended
            if(activeBlocks.length <= blocks.length){

              activeBlocks.push(blocks[workingPiece]);

              blocks[workingPiece];

              if(workingPiece <= totalPieces){
                workingPiece = workingPiece+1;
              }else{
                workingPiece = 0;
              }

            }

            context.clearRect(0,0,canvas.width, canvas.height);

            for(var ei = 0; ei < activeBlocks.length; ++ei){

                if((blocks[blocks.length-1].x != blocks[blocks.length-1].toX)){
                  updateAndRender = true;

                }else{
                  updateAndRender = false;
                  //clearInterval(drawInterval);
                  window.cancelAnimationFrame(drawRequestID);
                  clearTimeout(drawTimeout);
                }

                if(updateAndRender == true){
                  // For some reason this still fires for 70 loops, not sure why, though this undefined IF at least stops errors in the console
                  if("undefined" !== typeof activeBlocks[ei]){
                    activeBlocks[ei].update();
                    activeBlocks[ei].render();
                  }
                }
            }

        }, 1000 / 60);
    }
    draw();
}
