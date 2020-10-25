const Animation = function(frameset, delay){
    this.delay = delay;
    this.count = 0;
    this.frameset = frameset;
}

Animation.prototype = {
    constructor : Animation,

    frame:function(){
        return {
            "frame" : this.frameset.current(),
            "width" : this.frameset.x,
            "height" : this.frameset.y
        }
    },

    update:function(){
        this.count ++;
        if(this.count == delay){
            this.count = 0;
            this.change();
        }
        return this.frame()
    }
}