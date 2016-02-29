const SoundcloudPlayer = function() {
    let player,
        _volume = 1.0,
        _duration = 0,
        _currentTime = 0,
        _paused = true,
        _volumeBeforeMuting = 1.0,
        onReadyCallback = function() {},
        playerContainer = document.createElement('div');

    function init(audioUrl, containerId) {
        loadApi(createPlayer.bind(this, audioUrl, containerId));
    }

    function createPlayer(audioUrl, containerId) {
        let baseUrl = 'https://w.soundcloud.com/player/?url=';
        let iframe = document.createElement('iframe');
        iframe.setAttribute('src', baseUrl + audioUrl);
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('frameborder', 'no');
        player = SC.Widget(iframe);
        player.bind(SC.Widget.Events.READY, preparePlayer);
        playerContainer.appendChild(iframe);
        document.getElementById(containerId).appendChild(playerContainer);
    }

    function loadApi(onload) {
        let script = document.createElement('script');
        script.setAttribute('id', 'sc-iframe-api');
        script.onload = onload;
        script.src = 'https://w.soundcloud.com/player/api.js';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    }

    function preparePlayer() {
        player.isPaused(function(paused) {_paused = paused;});
        player.getDuration(function(duration) {_duration = duration/1000; onReadyCallback();});
        player.getVolume(function(volume) {_volume = volume;});
        player.bind(SC.Widget.Events.PLAY, function(data) {_paused = false;});
        player.bind(SC.Widget.Events.PAUSE, function(data) {_paused = true;});
        player.bind(SC.Widget.Events.SEEK, function(data) {_currentTime = data/1000;});
        player.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {_currentTime = data.currentPosition/1000});
    }

    function play() {
        player.play();
    }

    function pause() {
        player.pause();
    }

    function destroy() {
        if (player) {
            player.unbind(SC.Widget.Events.READY);
            player.unbind(SC.Widget.Events.PLAY);
            player.unbind(SC.Widget.Events.PAUSE);
            player.unbind(SC.Widget.Events.SEEK);
            player.unbind(SC.Widget.Events.PLAY_PROGRESS);
            player.unbind(SC.Widget.Events.FINISH);
        }
        playerContainer.remove();
        document.getElementById('sc-iframe-api').remove();
        delete window.SC;
    }

    function paused() {
        return _paused;
    }

    function duration() {
        return _duration;
    }

    function currentTime() {
        return _currentTime;
    }

    function setCurrentTime(time) {
        if (_currentTime === 0) {
            play();
            pause();
        }
        player.seekTo(time * 1000);
        _currentTime = time;
    }

    function ended() {
        return currentTime() === duration() && duration() !== 0;
    }

    function volume() {
        return _volume;
    }

    function setVolume(vol) {
        player.setVolume(vol);
        _volume = vol;
    }

    function muted() {
        return volume() === 0;
    }

    function mute() {
        _volumeBeforeMuting = volume();
        setVolume(0);
    }

    function unmute() {
        setVolume(_volumeBeforeMuting);
    }

    function onReady(callback) {
        onReadyCallback = callback;
    }

    function onPlay(callback) {
        player.bind(SC.Widget.Events.PLAY, callback);
    }

    function onPause(callback) {
        player.bind(SC.Widget.Events.PAUSE, callback);
    }

    function onPlayTimeChange(callback) {
        player.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
            callback(data.currentPosition / 1000);
        });
    }

    function onEnded(callback) {
        player.bind(SC.Widget.Events.FINISH, callback);
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

export default SoundcloudPlayer;
