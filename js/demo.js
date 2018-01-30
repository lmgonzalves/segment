(function(){

    var path = document.getElementById('path'),
        segment = new Segment(path),
        begin = document.getElementById('begin'),
        end = document.getElementById('end'),
        duration = document.getElementById('duration'),
        easing = document.getElementById('easing'),
        draw = document.getElementById('draw'),
        random = document.getElementById('random'),
        length = path.getTotalLength(),
        randomBegin,
        randomEnd;

    draw.onclick = function(){
        segment.draw(begin.value, end.value, duration.value, {easing: d3[easing.value]});
    };

    random.onclick = function(){
        randomBegin = getRandomInt(0, length);
        randomEnd = getRandomInt(0, length);
        segment.draw(randomBegin, randomEnd, duration.value, {easing: d3[easing.value]});
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

})();
