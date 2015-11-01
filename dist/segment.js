/**
 * segment - A little JavaScript class (without dependencies) to draw and animate SVG path strokes
 * @version v0.0.2
 * @link https://github.com/lmgonzalves/segment
 * @license MIT
 */

function Segment(path, begin, end) {
    this.path = path;
    this.length = path.getTotalLength();
    this.path.style.strokeDashoffset = this.length * 2;
    this.begin = begin ? this.valueOf(begin) : 0;
    this.end = end ? this.valueOf(end) : this.length;
    this.timer = null;
    this.draw(this.begin, this.end);
}

Segment.prototype = {
    draw : function(begin, end, duration, options){
        if(duration){
            var delay = options.hasOwnProperty('delay') ? parseFloat(options.delay) * 1000 : 0,
                easing = options.hasOwnProperty('easing') ? options.easing : null,
                callback = options.hasOwnProperty('callback') ? options.callback : null,
                that = this;

            this.stop();
            if(delay) {
                delete options.delay;
                this.timer = setTimeout(function () {
                    that.draw(begin, end, duration, options);
                }, delay);
                return this.timer;
            }

            var startTime = new Date(),
                rate = 1000/60,
                initBegin = this.begin,
                initEnd = this.end,
                finalBegin = this.valueOf(begin),
                finalEnd = this.valueOf(end);

            (function calc(){
                var now = new Date(),
                    elapsed = (now-startTime)/1000,
                    time = (elapsed/parseFloat(duration)),
                    t = time;

                if(typeof easing === 'function') {
                    t = easing(t);
                }

                if(time > 1){
                    that.stop();
                    t = 1;
                }else{
                    that.timer = setTimeout(calc, rate);
                }

                that.begin = initBegin + (finalBegin - initBegin) * t;
                that.end = initEnd + (finalEnd - initEnd) * t;

                if(that.begin < 0) {
                    that.begin = 0;
                }

                if(that.end > that.length) {
                    that.end = that.length;
                }

                if(that.begin < that.end) {
                    that.draw(that.begin, that.end);
                }else{
                    that.draw(that.begin + (that.end - that.begin), that.end - (that.end - that.begin));
                }

                if(time > 1 && typeof callback === 'function'){
                    return callback.call(that.context);
                }
            })();
        }else{
            this.path.style.strokeDasharray = this.strokeDasharray(begin, end);
        }
    },

    strokeDasharray : function(begin, end){
        this.begin = this.valueOf(begin);
        this.end = this.valueOf(end);
        return [this.length, this.length + this.begin, this.end - this.begin].join(' ');
    },

    valueOf: function(input){
        var val = parseFloat(input);
        if(typeof input === 'string' || input instanceof String){
            if(~input.indexOf('%')){
                var arr;
                if(~input.indexOf('+')){
                    arr = input.split('+');
                    val = this.percent(arr[0]) + parseFloat(arr[1]);
                }else if(~input.indexOf('-')){
                    arr = input.split('-');
                    val = this.percent(arr[0]) - parseFloat(arr[1]);
                }else{
                    val = this.percent(input);
                }
            }
        }
        return val;
    },

    stop : function(){
        clearTimeout(this.timer);
        this.timer = null;
    },

    percent : function(value){
        return parseFloat(value) / 100 * this.length;
    }
};