var pybossaPlayer = function() {
    var video;

    function init(videoUrl, containerId) {
        video = document.createElement("video");
        video.setAttribute("src", videoUrl);
        video.setAttribute("width", 512);
        video.setAttribute('controls', true);
        document.getElementById(containerId).appendChild(video);
    }

    function play() {
        video.play();
    }

    function pause() {
        video.pause();
    }

    function destroy() {
        video.remove();
    }

    return {init: init, play: play, pause: pause, destroy: destroy};
}
