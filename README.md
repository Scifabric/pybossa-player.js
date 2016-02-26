[![Build Status](https://travis-ci.org/PyBossa/pybossa-player.js.svg?branch=master)](https://travis-ci.org/PyBossa/pybossa-player.js)

Small Javascript library to easily work with audio and video from multiple sources (native HTML5, YouTube, Vimeo and SoundCloud) in your PyBossa projects. Easy to use. Control videos from YouTube or Vimeo with the same code. Out of the box responsive player.

![Shuttleworth Foundation Funded](http://pybossa.com/assets/img/shuttleworth-funded.png)

# How to install and run the tests

If you want to install it locally and make some changes, clone this repository and run `npm install`. After making any change to the source code, you can re-build the by running `npm run build`. The distribution file containing the library will be created at [dist/pybossa-player.min.js](dist/pybossa-player.min.js).

In order to run the tests, run `npm test`.

# How to use

The library is included in PyBossa servers since versions above v1.5.1. You can use it in any PyBossa project running in a PyBossa server that includes it. Just include the library in yout presenter code:

```html
<script type="text/javascript" src="/static/js/pybossa-player/dist/pybossa-player.min.js"></script>
```

Alternatively, if you are running your project in a PyBossa server that does not include it, do it manually by copying the content of [dist/pybossa-player.min.js](dist/pybossa-player.min.js) inside a `<script>` tag in the presenter.

Create a player with `PybossaPlayer(videoUrl, elementId)`. The element will be created and inserted into the DOM element with `id = elementId`.

Do it inside the pybossa.presentTask callback, like so:

```javascript
pybossa.presentTask(function(task, deferred) {
    var player = PybossaPlayer(task.info.video_url, 'video-clip');

    player.onReady(function() {
        do stuff with your player here like adding event listeners, pausing, playing, etc.
    });

    $('#task-id').html(task.id);
    $('.btn-answer').off('click').on('click', function(evt) {
        var $btn = $(this);
        var answer = $btn.attr("value");
        pybossa.saveTask(task.id, answer).done(function() {
            // When you don't need it anymore, destroy it!
            deferred.resolve();
            player.destroy();
        });
    });
});
```

If you want to make sure an audio element is created, then you need to pass a `true` flag to the constructor:

`PybossaPlayer(task.info.audio_url, 'elementId', true)`

You can find a complete example of a project using all the features of the player in [this Crowdcrafting project](http://crowdcrafting.org/project/demopybossaplayerjs/). The source code of that example is right [here](example/).

# Compatible media sources

You can use any YouTube links, Vimeo links of the form `https://player.vimeo.com/video/<video_id>`, SoundCloud links (like `https://soundcloud.com/henry-saiz/henry-saiz-fill-me-up-feat`) or any files compatible with the HTML5 audio and video elements (See [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) for a list of compatible formats).

# API methods

- play(). Plays the current player.
- pause(). Pauses the current player.
- destroy(). Destroys the player. Removes it from the DOM too.
- paused(): bool. Wether the player is paused or not.
- duration(): number. Duration of the current video/audio, in seconds. If the player is not ready, will return 0.
- currentTime(): number. Current playback time, in seconds. Will return 0 if player is nor ready.
- setCurrentTime(number time). Seeks the player to `time`, in seconds.
- ended(): bool. Wether the playback ended.
- volume(): number in range(0,1). Volume level.
- setVolume(number in range(0,1) vol). Sets the volume to `vol`.
- muted(): bool. Wether the player is muted.
- mute(). Mutes the player.
- unmute(). Unmutes the player.
- onReady(callback). Executes `callback` when player is ready to play.
- onPlay(callback). Executes `callback` when player state changes to playing. Should be called after player is ready.
- onPause(callback). Executes `callback` when player state changes to paused. Should be called after player is ready.
- onPlayTimeChange(callback). Executes `callback` when player's `currentTime changes`. Will be fired during reproduction. Should be called after player is ready.
- onEnded(callback). Executes `callback` when playback ends. Should be called after player is ready.

# Contributing

If you want to contribute to the project, please, check the
[CONTRIBUTING file](CONTRIBUTING.md).

It has the instructions to become a contributor.

## Copyright / License

Copyright 2016 [SciFabric LTD](http://scifabric.com).

Source Code License: The GNU Affero General Public License, either version 3 of the License
or (at your option) any later version. (see [COPYING file](COPYING)).

The GNU Affero General Public License is a free, copyleft license for
software and other kinds of works, specifically designed to ensure
cooperation with the community in the case of network server software.
