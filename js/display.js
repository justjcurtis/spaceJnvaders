const Display = function(canvas) {

    this.bufferCanvas  = document.createElement("canvas"),
    this.buffer = this.bufferCanvas.getContext("2d"),
    this.context = canvas.getContext("2d");
  
    this.drawRectangle = function(x, y, width, height, color) {
  
      this.buffer.fillStyle = color;
      this.buffer.fillRect(Math.round(x), Math.round(y), width, height);
  
    };
  
    this.fill = function(color) {
  
      this.buffer.fillStyle = color;
      this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
  
    };
    this.clear = function(){
        this.buffer.clearRect(0, 0, this.bufferCanvas.width, this.bufferCanvas.height)
        this.context.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.drawText = function(text, x, y, size, color) {
      this.buffer.font = "bold " + size + "pt Arial";
      this.buffer.fillStyle = color;
      this.buffer.fillText(text, x, y);
    };

    this.drawSpriteFrame = function(src, x, y, width, height){
      var img = new Image();
      img.src = src;
      this.buffer.drawImage(img, 0, 0, img.width, img.height, x, y, width, height); 
    }

    this.fillImage = function(src) {
      var img = new Image();
      img.src = src;
      this.buffer.drawImage(img, 0, 0);
  
    };
  
    this.render = function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); };
    this.resize = function(width, height, height_width_ratio) {
        height *= 0.8
      if (height / width > height_width_ratio) {
  
        this.context.canvas.height = width * height_width_ratio;
        this.context.canvas.width = width;
  
      } else {
  
        this.context.canvas.height = height;
        this.context.canvas.width = height / height_width_ratio;
  
      }
  
      this.context.imageSmoothingEnabled = false;
  
    };
  
  };
  
  Display.prototype = {
  
    constructor : Display
  
  };