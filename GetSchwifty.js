(function() {

    // paul irish wankyness
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
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


    // GetSchwifty.js
    this.GetSchwifty = function() {

        // Defaults
        var defaults = {
            selector: "canvas",
            rowPieces: 8,
            columnPieces: 8,
            yUpdateSpeed: 50,
            xUpdateSpeed: 50,
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
          this.options = extendDefaults(defaults, arguments[0]);
        }

        function extendDefaults(source, properties) {
            var property;
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
        }

        var canvas = document.querySelector(this.options.selector),
          context = canvas.getContext("2d"),
          img = new Image(),
          rowPieces = this.options.rowPieces,
          columnPieces = this.options.columnPieces,
          totalPieces = rowPieces*columnPieces,
          workingPiece = 0,
          yUpdateSpeed = this.options.yUpdateSpeed, // the amount of pixels it will update per iteration
          xUpdateSpeed = this.options.xUpdateSpeed, // the amount of pixels it will update per iteration
          blocks = [],
          activeBlocks = [],
          updateAndRender = true,
          drawRequestID,
          drawTimeout,
          preStartSySxAnimationFlag = true,
            blocksAxisData = [],
            xOrYIsFalse = false,
          startSySxAnimation = false;

        img.src = this.options.img;

        //   // set height & width
        canvas.width = this.options.width;
        canvas.height = this.options.height;

        img.onload = function(){

          function theLoop(){
            var loopCount = 1;
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
            this.axisYFullyReset = false;
            this.axisXFullyReset = false;
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

                if(this.sy < this.toSy){
                    this.sy+=yUpdateSpeed;
                } else{
                    this.sy = this.toSy;
                }

                if(this.sx < this.toSx){
                    this.sx+=xUpdateSpeed;
                } else{
                    this.sx = this.toSx;
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
              }

            //draw the screen
            function draw() {
                drawTimeout = setTimeout(function() {
                    drawRequestID = window.requestAnimationFrame(draw);

                    // This stops active blocks from growing larger than intended
                    if(activeBlocks.length <= blocks.length){

                      activeBlocks.push(blocks[workingPiece]);

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

                          if(preStartSySxAnimationFlag === true){
                              setTimeout(function(){
                                  startSySxAnimationFunctionJustOnce = true;
                                  startSySxAnimationFunction();
                              }, 2000);
                              preStartSySxAnimationFlag = false;
                          }

                        }

                        if(blocksAxisData.length === blocks.length){

                            for(var bi=0; bi<blocksAxisData.length; bi++){
                                // This if should only fire if the x or y axis is false, (meaning that one or the other hasn't been reset to do the final animation)
                                if(blocksAxisData[bi].x === false || blocksAxisData[bi].y === false){
                                    xOrYIsFalse = true;
                                    break;
                                }
                                // The last itteration to stop under and rendering on the canvas
                                if(bi === blocksAxisData.length-1){
                                    xOrYIsFalse = true;
                                }
                            }
                            if(xOrYIsFalse === true){
                                updateAndRender = false;
                                break;
                            }

                        }

                        if(updateAndRender === true){
                          // For some reason this still fires for 70 loops, not sure why, though this undefined IF at least stops errors in the console
                          if("undefined" !== typeof activeBlocks[ei]){
                            activeBlocks[ei].update();
                            activeBlocks[ei].render();
                          }
                        } else {
                          if(drawRequestID){
                              window.cancelAnimationFrame(drawRequestID);

                          }
                        }
                    }

                }, 1000 / 60);
            }
            draw();
        };

    };

}());
