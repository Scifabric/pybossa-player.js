import Html5Player from './players/html5';
import VimeoPlayer from './players/vimeo';
import YoutubePlayer from './players/youtube';
import SoundcloudPlayer from './players/soundcloud';


function injectCss() {
    let css = '.responsivePlayer {position: relative;padding-bottom: 56.25%;padding-top: 60px;overflow: hidden;} .responsivePlayer iframe {position: absolute;top: 0;left: 0;width: 100%;height: 100%;}';

    let head = document.head || document.getElementsByTagName('head')[0];

    let style = document.createElement('style');
    style.type = 'text/css';
    style.id = "pybossa-player-styles";

    if (!document.getElementById("pybossa-player-styles")) {
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }
}


var PybossaPlayer = function(mediaUrl, containerId, isAudio) {
    var player;

    if (isVimeoLink(mediaUrl)) {
        player = VimeoPlayer();
    }
    else if (isYoutubeLink(mediaUrl)){
        player = YoutubePlayer();
    }
    else if (isSoundcloudLink(mediaUrl)) {
        player = SoundcloudPlayer();
    }
    else {
        player = Html5Player(isAudio);
    }

    function isYoutubeLink(link) {
       return YoutubePlayer().isYoutubeLink(link);
    }

    function isVimeoLink(link) {
        return link.indexOf('vimeo') !== -1;
    }

    function isSoundcloudLink(link) {
        return link.indexOf('soundcloud') !== -1;
    }

    player.init(mediaUrl, containerId);
    injectCss();

    function play() {
        player.play();
    }

    function pause() {
        player.pause();
    }

    function destroy() {
        player.destroy();
    }

    function paused() {
        return player.paused();
    }

    function duration() {
        return player.duration();
    }

    function currentTime() {
        return player.currentTime();
    }

    function setCurrentTime(time) {
        player.setCurrentTime(time);
    }

    function ended() {
        return player.ended();
    }

    function volume() {
        return player.volume();
    }

    function setVolume(volume) {
        player.setVolume(volume);
    }

    function muted() {
        return player.muted();
    }

    function mute() {
        player.mute();
    }

    function unmute() {
        player.unmute();
    }

    function onReady(callback) {
        player.onReady(callback);
    }

    function onPlay(callback) {
        player.onPlay(callback);
    }

    function onPause(callback) {
        player.onPause(callback);
    }

    function onPlayTimeChange(callback) {
        player.onPlayTimeChange(callback);
    }

    function onEnded(callback) {
        player.onEnded(callback);
    }

    return {
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

export default PybossaPlayer;

(function () {
    if (window) {
        window.PybossaPlayer = PybossaPlayer;
    }
})();
