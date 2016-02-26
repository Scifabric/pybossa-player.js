const Html5Player = function(isAudio) {
    let player;

    function init(url, containerId) {
        const element = isAudio ? "audio" : "video";
        player = document.createElement(element);
        player.setAttribute("src", url);
        player.setAttribute('width', '100%');
        player.setAttribute('height', 'auto');
        player.setAttribute('controls', true);
        document.getElementById(containerId).appendChild(player);
    }

    function play() {
        player.play();
    }

    function pause() {
        player.pause();
    }

    function destroy() {
        player.remove();
    }

    function paused() {
        return player.paused;
    }

    function duration() {
        if (isNaN(player.duration)) return 0;
        return player.duration;
    }

    function currentTime() {
        return player.currentTime;
    }

    function setCurrentTime(time) {
        player.currentTime = time;
    }

    function ended() {
        return player.ended;
    }

    function volume() {
        return player.volume;
    }

    function setVolume(volume) {
        player.volume = volume;
    }

    function muted() {
        return player.muted;
    }

    function mute() {
        player.muted = true;
    }

    function unmute() {
        player.muted = false;
    }

    function onReady(callback) {
        player.addEventListener('loadedmetadata', callback);
    }

    function onPlay(callback) {
        player.addEventListener('playing', callback);
    }

    function onPause(callback) {
        player.addEventListener('pause', callback);
    }

    function onPlayTimeChange(callback) {
        let onPlayTimeChangeCb = function() {callback(currentTime());};
        player.addEventListener('timeupdate', onPlayTimeChangeCb);
    }

    function onEnded(callback) {
        player.addEventListener('ended', callback);
    }

    return {
        init: init,
        play: play,
        pause: pause,
        destroy: destroy,
        paused: paused,
        duration: duration,
        currentTime: currentTime,
        setCurrentTime: setCurrentTime,
        ended: ended,
        volume: volume,
        setVolume: setVolume,
        muted: muted,
        mute: mute,
        unmute: unmute,
        onReady: onReady,
        onPlay: onPlay,
        onPause: onPause,
        onPlayTimeChange: onPlayTimeChange,
        onEnded: onEnded
    };
}

export default Html5Player;
