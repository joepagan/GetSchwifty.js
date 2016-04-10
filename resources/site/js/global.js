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
  rowPieces = 4,
  columnPieces = 4,
  totalPieces = rowPieces*columnPieces,
  workingPiece = 0,
  yUpdateSpeed = 100, // the amount of pixels it will update per iteration
  xUpdateSpeed = 100, // the amount of pixels it will update per iteration
  blocks = [],
  activeBlocks = [],
  updateAndRender = true,
  drawRequestID,
  drawTimeout,
  preStartSySxAnimationFlag = true;
  resetSySxAnimation = false,
  startSySxAnimation = false,
  startSySxAnimationFunctionJustOnce = false,
  sySxAnimationReset = true;

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
            ((img.width/rowPieces)*rowCount), //sx - this will eventually change so we need the fromSx variable below
            ((img.width/rowPieces)*rowCount), //fromSx
            0, // toSx - get defined later
            ((canvas.width/rowPieces)*rowCount), //x
            (canvas.width/rowPieces), // fromX
            ((canvas.width/rowPieces)*rowCount), // toX
            ((img.height/columnPieces)*colCount), // sy
            ((img.height/columnPieces)*colCount), // fromSy - this will eventually change so we need the fromSy variable below
            0, // toSy - gets defined later
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

  function Block(w, sWidth, h, sHeight, sx, fromSx, toSx, x, fromX, toX, sy, fromSy, toSy, y, fromY, toY, loopCount){
    this.w = w;
    this.sWidth = sWidth;
    this.h = h;
    this.sHeight = sHeight;
    this.sx = sx;
    this.fromSx = fromSx;
    this.toSx = toSx;
    this.x = -x;
    this.fromX = fromX;
    this.toX = toX;
    this.sy = sy;
    this.fromSy = fromSy;
    this.toSy = toSy;
    this.y = -y;
    this.fromY = fromY;
    this.toY = toY;
    this.i = loopCount;
  }

  Block.prototype.update = function(){
    // so if the increment is NOT enlarged by "1" the position could final up being offset
    if(this.y < this.toY){
        this.y+=yUpdateSpeed;
    }
    //reset the y pos if y ends up being larger than it's  desired value.
    if(this.y > this.toY){
      this.y = this.toY;
    }
    // so if the increment is NOT enlarged by "1" the position could final up being offset
    if(this.x < this.toX){
      this.x+=xUpdateSpeed;
    }
    // reset the x pos if x ends up being larger than it's desired value.
    if(this.x > this.toX){
      this.x = this.toX;
    }

    if(startSySxAnimation === true){

        if(this.toSy > this.fromSy){
            if(this.sy < this.toSy){
                this.sy+=yUpdateSpeed;
            } else{
                this.sy = this.toSy;
            }
        }

        if(this.toSy < this.fromSy){
            if(this.sy > this.toSy){
                this.sy-=yUpdateSpeed;
            } else{
                this.sy = this.toSy;
            }
        }

        if(this.toSx > this.fromSx){
            if(this.sx < this.toSx){
                this.sx+=xUpdateSpeed;
            } else{
                this.sx = this.toSx;
            }
        }


        if(this.toSx < this.fromSx){
            if(this.sx > this.toSx){
                this.sx-=xUpdateSpeed;
            } else{
                this.sx = this.toSx;
            }
        }
    }

    if(resetSySxAnimation === true){

        //console.log(this.sy +"--"+ this.fromSy);

        if(this.sy >= this.fromSy){
            if(this.sy > this.toSy){
                this.sy-=yUpdateSpeed;
            } else{
                this.sy = this.toSy;
            }
        }

        if(this.sy <= this.fromSy){
            if(this.sy < this.toSy){
                this.sy+=yUpdateSpeed;
            } else{
                this.sy = this.toSy;
            }
        }

        if(this.sx >= this.fromSx){
            if(this.sx > this.toSx){
                this.sx-=xUpdateSpeed;
            } else{
                this.sx = this.toSx;
            }
        }


        if(this.sx <= this.fromSx){
            if(this.sx < this.toSx){
                this.sx+=xUpdateSpeed;
            } else{
                this.sx = this.toSx;
            }
        }

    }

  };

  Block.prototype.render = function(){
    context.drawImage(img, this.sx, this.sy, this.sWidth, this.sHeight, this.x, this.y, this.w, this.h);
  };

      function startSySxAnimationFunction(){
          if(startSySxAnimationFunctionJustOnce === true){
              blocks.reverse();

              for(var ei = 0; ei < activeBlocks.length-1; ++ei){
                  activeBlocks[ei].toSy = blocks[ei].fromSy;
                  activeBlocks[ei].toSx = blocks[ei].fromSx;
              }
              startSySxAnimation = true; // This is for the block update function
          }
          startSySxAnimationFunctionJustOnce = false;
      }

      function resetSySxAnimationFunction(){
          if(startSySxAnimationFunctionJustOnce === true){
              blocks.reverse();

              for(var ei = 0; ei < activeBlocks.length-1; ++ei){
                  activeBlocks[ei].toSy = blocks[ei].fromSy;
                  activeBlocks[ei].toSx = blocks[ei].fromSx;
                  activeBlocks[ei].fromSy = activeBlocks[ei].sy;
                  activeBlocks[ei].fromSx = activeBlocks[ei].sx;
              }
              resetSySxAnimation = true; // This is for the block update function
          }
          startSySxAnimationFunctionJustOnce = false;
      }

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

                if((blocks[blocks.length-1].x != blocks[blocks.length-1].toX) || (blocks[blocks.length-1].y != blocks[blocks.length-1].toY)){
                  updateAndRender = true;
                }else{
                  //updateAndRender = false;
                  if(preStartSySxAnimationFlag === true){
                      setTimeout(function(){
                          startSySxAnimationFunctionJustOnce = true;
                          startSySxAnimationFunction();
                      }, 2000);
                      preStartSySxAnimationFlag = false;
                  }
                  // post sysxanimation
                  if(activeBlocks[0].i == blocks[blocks.length-1].i){
                      if(activeBlocks[0].sx == activeBlocks[0].toSx && activeBlocks[0].sy == activeBlocks[0].toSy){

                          if(sySxAnimationReset === true){
                              sySxAnimationReset = false;
                              setTimeout(function(){
                                  startSySxAnimationFunctionJustOnce = true;
                                  resetSySxAnimationFunction();
                              }, 2000);
                          }

                      }

                  }
                  //window.cancelAnimationFrame(drawRequestID);
                  //clearTimeout(drawTimeout);
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
