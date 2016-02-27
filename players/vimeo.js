const VimeoPlayer = function() {
    let player,
        playerContainer,
        onReadyCallback = function() {};

    function init(videoUrl, containerId) {
        // Modified version of Froogaloop original by Vimeo:
        // https://github.com/vimeo/player-api/blob/master/javascript/froogaloop.js
        const vimeoApi = (function(){
            function Froogaloop(iframe) {
                return new Froogaloop.fn.init(iframe);
            }

            let eventCallbacks = {},
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

                    let self = this,
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

                    let self = this,
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

                    let self = this,
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

                let data = JSON.stringify({
                    method: method,
                    value: params
                });

                target.contentWindow.postMessage(data, playerOrigin);
            }

            function onMessageReceived(event) {
                let data, method;

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

                let value = data.value,
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
                if (target_id && eventCallbacks[target_id]) {
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
        const playerId = 'vimeo-' + Date.now();
        this.iframe.id = playerId;
        this.iframe.setAttribute('src', this.baseUrl + this.videoId + '?api=1&player_id=' + playerId);
        this.iframe.setAttribute('frameborder', '0');
        this.iframe.setAttribute('scrolling', 'no');

        player = vimeoApi(this.iframe);

        playerContainer = document.createElement('div');
        playerContainer.setAttribute('class', 'responsivePlayer');
        playerContainer.appendChild(this.iframe);
        document.getElementById(containerId).appendChild(playerContainer);
        player.addEvent('ready', preparePlayer);
    }

    let _volume = 1.0,
        _duration = 0,
        _currentTime = 0,
        _paused = true,
        _volumeBeforeMuting = 1.0;

    function preparePlayer() {
        player.addEvent('pause', function() {_paused = true;});
        player.addEvent('play', function() {_paused = false;});
        player.addEvent('playProgress', function(value) {_currentTime = value.seconds;});
        player.addEvent('seek', function(value) {_currentTime = value.seconds;});
        player.api('getVolume', function(value) {_volume = value;});
        player.api('getDuration', function(value) {_duration = value; onReadyCallback();});
    }

    function play() {
        _paused = false;
        player.api('play');
    }

    function pause() {
        _paused = true;
        player.api('pause');
    }

    function destroy() {
        player.removeEvent('ready');
        player.removeEvent('play');
        player.removeEvent('pause');
        player.removeEvent('playProgress');
        player.removeEvent('seek');
        playerContainer.remove();
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
        if (time <= _duration) _currentTime = time;
        let wasPaused = paused();
        player.api('seekTo', time);
        if (wasPaused) pause();
    }

    function ended() {
        return currentTime() === duration();
    }

    function volume() {
        return _volume;
    }

    function setVolume(vol) {
        player.api('setVolume', vol);
        if (vol <= 1 && vol >= 0) _volume = vol;
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
        player.addEvent('ready', function() {
            player.addEvent('play', function() {
                callback();
            })
        });
    }

    function onPause(callback) {
        player.addEvent('ready', function() {
            player.addEvent('pause', function() {
                callback();
            })
        });
    }

    function onPlayTimeChange(callback) {
        player.addEvent('ready', function() {
            player.addEvent('playProgress', function(data) {
                callback(data.seconds);
            })
        });
    }

    function onEnded(callback) {
        player.addEvent('ready', function() {
            player.addEvent('finish', function() {
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
        onReady: onReady,
        onPlay: onPlay,
        onPause: onPause,
        onPlayTimeChange: onPlayTimeChange,
        onEnded: onEnded
    };
}

export default VimeoPlayer;
