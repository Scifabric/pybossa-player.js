const YoutubePlayer = function() {
    let player,
        onReadyCallback = function() {},
        onPlayCallback = function() {},
        onPauseCallback = function() {},
        onPlayTimeChangeCallback = function() {},
        onEndedCallback = function() {},
        playerContainerId = 'youtube-container-' + Date.now(),
        timeUpdateInterval;

    function init(videoUrl, containerId) {
        let div = document.createElement('div');
        div.setAttribute('id', playerContainerId);
        document.getElementById(containerId).appendChild(div);

        let iFrameApiTag = document.getElementById('yt-iframe-api');
        if (iFrameApiTag) {
            let createNewPlayer = function() {
                createPlayer(videoUrl);
                delete window.onPreviousPlayerDestroyed;
            };
            window.onPreviousPlayerDestroyed = createNewPlayer;
            createNewPlayer();
            delete window.onYouTubeIframeAPIReady;
        }
        else {
            window.onYouTubeIframeAPIReady = function() {
                createPlayer(videoUrl);
            };
            loadApi();
        }
    }

    function createPlayer(videoUrl) {
        let videoId = extractVideoId(videoUrl);
        player = new YT.Player(playerContainerId, {
            height: '390',
            width: '640',
            videoId: videoId,
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            }
        });
    }

    function extractVideoId(videoUrl) {
        let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        let r = videoUrl.match(rx);
        return r[1];
    }

    function onPlayerReady() {
        onReadyCallback();
    }

    function onPlayerStateChange(event) {
        let state = event.data;
        if (state === 1) {
            onPlayCallback();
            return;
        }
        if (state === 2) {
            onPauseCallback();
            return;
        }
        if (state === 0) {
            onEndedCallback();
            return;
        }
    }

    function loadApi() {
        let script = document.createElement('script');
        script.setAttribute('id', 'yt-iframe-api');
        script.src = 'https://www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    }

    function play() {
        player.playVideo();
    }

    function pause() {
        player.pauseVideo();
    }

    function destroy() {
        player.destroy();
        document.getElementById(playerContainerId).remove();
        if (window.onPreviousPlayerDestroyed) {
            window.onPreviousPlayerDestroyed();
            delete window.onPreviousPlayerDestroyed;
        }
        clearInterval(timeUpdateInterval);
    }

    function paused() {
        return player.getPlayerState() !== 1;
    }

    function duration() {
        return player.getDuration();
    }

    function currentTime() {
        return player.getCurrentTime();
    }

    function setCurrentTime(time) {
        let wasPaused = paused();
        player.seekTo(time);
        if (wasPaused) pause();
    }

    function ended() {
        return player.getPlayerState() === 0;
    }

    function volume() {
        return player.getVolume() / 100.0;
    }

    function setVolume(volume) {
        player.setVolume(volume * 100);
    }

    function muted() {
        return player.isMuted();
    }

    function mute() {
        player.mute();
    }

    function unmute() {
        player.unMute();
    }

    function onReady(callback) {
        if (player) {
            callback();
        }
        else {
            onReadyCallback = callback;
        }
    }

    function onPlay(callback) {
        onPlayCallback = callback;
    }

    function onPause(callback) {
        onPauseCallback = callback;
    }

    function onPlayTimeChange(callback) {
        onPlayTimeChangeCallback = callback;
        let onTimeChange = function() {
            let time = currentTime();
            if (!paused()) onPlayTimeChangeCallback(time);
        }
        timeUpdateInterval = setInterval(onTimeChange, 200);
    }

    function onEnded(callback) {
        onEndedCallback = callback;
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

export default YoutubePlayer;
