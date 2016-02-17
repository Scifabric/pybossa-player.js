var html5Player = function() {
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

    function paused() {
        return video.paused;
    }

    function duration() {
        return video.duration;
    }

    function currentTime() {
        return video.currentTime;
    }

    function setCurrentTime(time) {
        video.currentTime = time;
    }

    function ended() {
        return video.ended;
    }

    function volume() {
        return video.volume;
    }

    function setVolume(volume) {
        video.volume = volume;
    }

    function muted() {
        return video.muted;
    }

    function mute() {
        video.muted = true;
    }

    function unmute() {
        video.muted = false;
    }

    function onDurationAvailable(callback) {
        var onLoadedMetadata = function() {callback(duration());};
        video.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    function onPlay(callback) {
        video.addEventListener('playing', callback);
    }

    function onPause(callback) {
        video.addEventListener('pause', callback);
    }

    function onPlayTimeChange(callback) {
        var onPlayTimeChangeCb = function() {callback(currentTime());};
        video.addEventListener('timeupdate', onPlayTimeChangeCb);
    }

    function onEnded(callback) {
        video.addEventListener('ended', callback);
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
        onDurationAvailable: onDurationAvailable,
        onPlay: onPlay,
        onPause: onPause,
        onPlayTimeChange: onPlayTimeChange,
        onEnded: onEnded
    };
}


var vimeoPlayer = function() {
    var video,
        divWrapper;

    function init(videoUrl, containerId) {
        var vimeoApi = (function(){
            function Froogaloop(iframe) {
                return new Froogaloop.fn.init(iframe);
            }

            var eventCallbacks = {},
                hasWindowEvent = false,
                isReady = false,
                slice = Array.prototype.slice,
                playerOrigin = '*';

            Froogaloop.fn = Froogaloop.prototype = {
                element: null,

                init: function(iframe) {
                    if (typeof iframe === "string") {
                        iframe = document.getElementById(iframe);
                    }

                    this.element = iframe;

                    return this;
                },

                api: function(method, valueOrCallback) {
                    if (!this.element || !method) {
                        return false;
                    }

                    var self = this,
                        element = self.element,
                        target_id = element.id !== '' ? element.id : null,
                        params = !isFunction(valueOrCallback) ? valueOrCallback : null,
                        callback = isFunction(valueOrCallback) ? valueOrCallback : null;

                    if (callback) {
                        storeCallback(method, callback, target_id);
                    }

                    postMessage(method, params, element);
                    return self;
                },

                addEvent: function(eventName, callback) {
                    if (!this.element) {
                        return false;
                    }

                    var self = this,
                        element = self.element,
                        target_id = element.id !== '' ? element.id : null;


                    storeCallback(eventName, callback, target_id);

                    if (eventName != 'ready') {
                        postMessage('addEventListener', eventName, element);
                    }
                    else if (eventName == 'ready' && isReady) {
                        callback.call(null, target_id);
                    }

                    return self;
                },

                removeEvent: function(eventName) {
                    if (!this.element) {
                        return false;
                    }

                    var self = this,
                        element = self.element,
                        target_id = element.id !== '' ? element.id : null,
                        removed = removeCallbacks(eventName, target_id);

                    if (eventName != 'ready' && removed) {
                        postMessage('removeEventListener', eventName, element);
                    }
                }
            };

            function postMessage(method, params, target) {
                if (!target.contentWindow.postMessage) {
                    return false;
                }

                var data = JSON.stringify({
                    method: method,
                    value: params
                });

                target.contentWindow.postMessage(data, playerOrigin);
            }

            function onMessageReceived(event) {
                var data, method;

                try {
                    data = JSON.parse(event.data);
                    method = data.event || data.method;
                }
                catch(e) {
                }

                if (method == 'ready' && !isReady) {
                    isReady = true;
                }

                if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
                    return false;
                }

                if (playerOrigin === '*') {
                    playerOrigin = event.origin;
                }

                var value = data.value,
                    eventData = data.data,
                    target_id = target_id === '' ? null : data.player_id,

                    callbacks = getCallbacks(method, target_id),
                    params = [];

                if (!callbacks) {
                    return false;
                }

                if (value !== undefined) {
                    params.push(value);
                }

                if (eventData) {
                    params.push(eventData);
                }

                if (target_id) {
                    params.push(target_id);
                }

                callbacks.forEach(function(callback) {
                    params.length > 0 ? callback.apply(null, params) : callback.call();
                });
            }

            function storeCallback(eventName, callback, target_id) {
                if (target_id) {
                    if (!eventCallbacks[target_id]) {
                        eventCallbacks[target_id] = {};
                    }
                    if (!eventCallbacks[target_id][eventName]) {
                        eventCallbacks[target_id][eventName] = [];
                    }
                    eventCallbacks[target_id][eventName].push(callback);
                }
                else {
                    if (!eventCallbacks[eventName]) {
                        eventCallbacks[eventName] = [];
                    }
                    eventCallbacks[eventName].push(callback);
                }
            }

            function getCallbacks(eventName, target_id) {
                if (target_id) {
                    return eventCallbacks[target_id][eventName];
                }
                else {
                    return eventCallbacks[eventName];
                }
            }

            function removeCallbacks(eventName, target_id) {
                if (target_id && eventCallbacks[target_id]) {
                    if (!eventCallbacks[target_id][eventName]) {
                        return false;
                    }
                    eventCallbacks[target_id][eventName] = null;
                }
                else {
                    if (!eventCallbacks[eventName]) {
                        return false;
                    }
                    eventCallbacks[eventName] = null;
                }

                return true;
            }

            function isFunction(obj) {
                return !!(obj && obj.constructor && obj.call && obj.apply);
            }

            function isArray(obj) {
                return toString.call(obj) === '[object Array]';
            }

            Froogaloop.fn.init.prototype = Froogaloop.fn;

            if (window.addEventListener) {
                window.addEventListener('message', onMessageReceived, false);
            }
            else {
                window.attachEvent('onmessage', onMessageReceived);
            }

            return Froogaloop;

        })();

        this.baseUrl = 'https://player.vimeo.com/video/';
        this.videoId = videoUrl.split('//player.vimeo.com/video/')[1];

        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('title', 'Vimeo Video Player');
        this.iframe.setAttribute('class', 'vimeoplayer');
        this.iframe.setAttribute('src', this.baseUrl + this.videoId + '?api=1');
        this.iframe.setAttribute('frameborder', '0');
        this.iframe.setAttribute('scrolling', 'no');
        this.iframe.setAttribute('marginWidth', '0');
        this.iframe.setAttribute('marginHeight', '0');
        this.iframe.setAttribute('webkitAllowFullScreen', '0');
        this.iframe.setAttribute('mozallowfullscreen', '0');
        this.iframe.setAttribute('allowFullScreen', '0');

        video = vimeoApi(this.iframe);

        divWrapper = document.createElement('div');
        divWrapper.setAttribute('style', 'margin:0 auto;padding-bottom:56.25%;width:100%;height:0;position:relative;overflow:hidden;');
        divWrapper.setAttribute('class', 'vimeoFrame');
        divWrapper.appendChild(this.iframe);
        document.getElementById(containerId).appendChild(divWrapper);
        video.addEvent('ready', setPlayerInformationCallbacks);
    }

    var _volume = 1.0,
        _duration = 0,
        _currentTime = 0,
        _paused = true,
        _mutedPreviousVolume = 1.0;

    function setPlayerInformationCallbacks() {
        video.addEvent('pause', function() {_paused = true;});
        video.addEvent('play', function() {_paused = false;});
        video.addEvent('playProgress', function(value) {_currentTime = value.seconds;});
        video.addEvent('loadProgress', function(value) {_duration = value.duration;});
        video.api('getVolume', function(value) {_volume = value;});
        video.api('getDuration', function(value) {_duration = value;});
        injectCss();
    }

    function injectCss() {
      var css = '.vimeoplayer { width:100%; height:180%; position:absolute; left:0; top:-40%; }';

      var head = document.head || document.getElementsByTagName('head')[0];

      var style = document.createElement('style');
      style.type = 'text/css';

      if (style.styleSheet){
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      head.appendChild(style);
    }

    function play() {
        video.api('play');
    }

    function pause() {
        video.api('pause');
    }

    function destroy() {
        divWrapper.remove();
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
        var wasPaused = paused();
        video.api('seekTo', time);
        if (wasPaused) player.pause();
    }

    function ended() {
        return currentTime() === duration();
    }

    function volume() {
        return _volume;
    }

    function setVolume(vol) {
        video.api('setVolume', vol);
        _volume = vol;
    }

    function muted() {
        return volume() === 0;
    }

    function mute() {
        _mutedPreviousVolume = volume();
        setVolume(0);
    }

    function unmute() {
        video.api('setVolume', _mutedPreviousVolume);
        _volume = _mutedPreviousVolume;
    }

    function onDurationAvailable(callback) {
        video.api('ready', function() {
            video.api('getDuration', function(duration) {
                callback(duration);
            })
        });
    }

    function onPlay(callback) {
        video.api('ready', function() {
            video.addEvent('play', function() {
                callback();
            })
        });
    }

    function onPause(callback) {
        video.api('ready', function() {
            video.addEvent('pause', function() {
                callback();
            })
        });
    }

    function onPlayTimeChange(callback) {
        video.api('ready', function() {
            video.addEvent('playProgress', function(data) {
                callback(data.seconds);
            })
        });
    }

    function onEnded(callback) {
        video.api('ready', function() {
            video.addEvent('finish', function() {
                callback();
            })
        });
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
        onDurationAvailable: onDurationAvailable,
        onPlay: onPlay,
        onPause: onPause,
        onPlayTimeChange: onPlayTimeChange,
        onEnded: onEnded
    };
}


var youtubePlayer = function() {
    var player,
        durationReadyCallback = function(){};

    function init(videoUrl, containerId) {
        var div = document.createElement('div');
        div.setAttribute('id', containerId);
        div.setAttribute('style', 'width:100%;height:100%;top:0;left:0;position:absolute');

        var divWrapper = document.createElement('div');
        divWrapper.appendChild(div);

        document.getElementById(containerId).appendChild(divWrapper);
        window.onYouTubeIframeAPIReady = function() {createPlayer(videoUrl, containerId);}
        loadApi();
    }

    function createPlayer(videoUrl, containerId) {
        var videoId = extractVideoId(videoUrl);
        player = new YT.Player(containerId, {
            height: '390',
            width: '640',
            videoId: videoId,
            events: {onReady: playerReady}
        });
    }

    function extractVideoId(videoUrl) {
        var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        var r = videoUrl.match(rx);
        return r[1];
    }

    function playerReady() {
        durationReadyCallback(duration());
    }

    function loadApi() {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    function play() {
        player.playVideo();
    }

    function pause() {
        player.pauseVideo();
    }

    function destroy() {
        player.destroy();
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
        var wasPaused = paused();
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

    function onDurationAvailable(callback) {
        if (player) {
            callback(duration());
        }
        else {
            durationReadyCallback = callback;
        }
    }

    function onPlay(callback) {
    }

    function onPause(callback) {
    }

    function onPlayTimeChange(callback) {
    }

    function onEnded(callback) {
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
        onDurationAvailable: onDurationAvailable,
        onPlay: onPlay,
        onPause: onPause,
        onPlayTimeChange: onPlayTimeChange,
        onEnded: onEnded
    };
}

var pybossaPlayer = function(videoUrl, containerId) {
    var player;

    if (videoUrl.split('.').indexOf('vimeo') !== -1) {
        player = vimeoPlayer();
    }
    else if (isYoutubeLink(videoUrl)){
        player = youtubePlayer();
    }
    else {
        player = html5Player();
    }

    function isYoutubeLink(link) {
        var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        var r = link.match(rx);
        return r !== null;
    }

    player.init(videoUrl, containerId);

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

    function onDurationAvailable(callback) {
        player.onDurationAvailable(callback);
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
        onDurationAvailable: onDurationAvailable,
        onPlay: onPlay,
        onPause: onPause,
        onPlayTimeChange: onPlayTimeChange,
        onEnded: onEnded
    };
}
