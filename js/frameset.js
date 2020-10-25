const FrameSet = function(source, x, y, length, offset, pattern){
    this.source = source;
    this.x = x;
    this.y = y;
    this.length = length;
    this.offset = offset;
    this.pattern = pattern;
    this.index = 0;

    this.frames = undefined;

    this._init = function(){
        var frames = [];
        for(var i = this.offset; (i - this.offset) < this.length; i++ ){
            frames.push(i)
        }
        for(var pat in pattern){
            this.frames.push(frames[pat]);
        }
    }

    this.current = function(){
        return this.frames[index];
    }
    this.next = function(){
        var next = index + 1;
        if(next > this.frames.length-1){
            next = 0;
        }
        return this.frames[next];
    }
    this.previous = function(){
        var prev = index - 1;
        if(prev < 0){
            prev = this.frames.length - 1;
        }
        return this.frames[prev];
    }
    
    this.tick = function(){
        this.index++;
        if(this.index > this.frames.length - 1){
            this.index = 0;
        }
    }

    if(!this.frames){
        this._init();
    }
}

FrameSet.prototype = { constructor : FrameSet }