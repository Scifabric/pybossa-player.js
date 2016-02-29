import test from 'tape';
import PybossaPlayer from '../player';
import YoutubePlayer from '../players/youtube';

const containerId = 'player-container';
const youtubeUrl = 'https://www.youtube.com/watch?v=M4TH8rU8wZw';

function setUp() {
  const body = document.body;
  if (document.getElementsByTagName('iframe')[0]) {
    document.getElementsByTagName('iframe')[0].remove();
  }
  if (!document.getElementsByTagName('script')) {
    const fakeScript = document.createElement('script');
    body.appendChild(fakeScript);
  }
  if (!document.getElementById('containerId')) {
    const container = document.createElement('div');
    container.setAttribute('id', containerId);
    body.appendChild(container);
  }
}


test('Youtube player accepts a callback that is fired when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    assert.pass("Player is ready");
    assert.end();
    player.destroy();
  });
});

test('Youtube player.destroy() removes the player from DOM', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(youtubeUrl, containerId);

  assert.ok(document.getElementsByTagName('iframe')[0]);

  player.destroy();

  assert.notOk(document.getElementsByTagName('iframe')[0]);
});

test('Youtube player.duration() returns duration when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    setTimeout(function() {
      assert.equals(player.duration(), 465);
      assert.end();
      player.destroy();
    }, 100);
  });
});

test('Youtube player.duration() returns 0 when not ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  assert.equals(player.duration(), 0);
  player.destroy();
});

test('Youtube player.setCurrentTime(n) sets playback time to second n', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    player.setCurrentTime(2);
    setTimeout(function() {
      assert.equals(player.currentTime(), 2);
      assert.end();
      player.destroy();
    }, 100);
  });
});

test('Youtube player.ended() returns false if not ended', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    assert.equals(player.ended(), false);
    assert.end();
    player.destroy();
  });
});

test('Youtube player volume returns new volume after calling setVolume', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    player.setVolume(0.5);
    setTimeout(function() {
      assert.equals(player.volume(), 0.5);
      assert.end();
      player.destroy();
    }, 100);
  });
});

test('Youtube player muted() after muting and unmuting', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    player.mute();
    setTimeout(function() {
      assert.equals(player.muted(), true);
      player.unmute();
      setTimeout(function() {
        assert.equals(player.muted(), false);
        assert.end();
        player.destroy();
      }, 100);
    }, 100);
  });
});

test('Youtube player unmute() preserves volume prior to muted state', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    player.setVolume(0.5);
    player.mute();
    player.unmute();
    setTimeout(function() {
      assert.equals(player.volume(), 0.5);
      assert.end();
      player.destroy();
    }, 100);
  });
});

test('Youtube player.onEnded() accepts a callback fired when playback ends', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    player.onEnded(function() {
      assert.pass("player ended");
      assert.equals(player.ended(), true);
      assert.end();
      player.destroy();
    });
    player.setCurrentTime(464.4);
    player.play();
  });
});

test('Youtube player.onPlay() accepts a callback fired when playback starts', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    player.onPlay(function() {
      assert.pass("Play event fired");
      assert.end();
      player.destroy();
    });
    player.play();
  });
});

test('Youtube player.onPause() accepts a callback fired when playback pauses', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    player.onPlay(function () {
      player.pause();
    });
    player.onPause(function() {
      assert.pass("Pause event fired");
      assert.end();
      player.destroy();
    });
    player.play();
  });
});

test('Youtube player.onPlayTimeChange() accepts a callback fired when playtime changes', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(youtubeUrl, containerId);

  player.onReady(function() {
    player.onPlayTimeChange(function() {
      assert.pass("PlayTimeChange event fired");
      player.pause();
      assert.end();
      player.destroy();
    });
    player.play();
  });
});

test('Youtube player recognises Youtube URLs', (assert) => {
  let urls = [
    '//www.youtube-nocookie.com/embed/up_lNV-yoK4?rel=0',
    'http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo',
    'http://www.youtube.com/watch?v=cKZDdG9FTKY&feature=channel',
    'http://www.youtube.com/watch?v=yZ-K7nCVnBI&playnext_from=TL&videos=osPknwzXEas&feature=sub',
    'http://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I',
    'http://www.youtube.com/user/SilkRoadTheatre#p/a/u/2/6dwqZw0j_jY',
    'http://youtu.be/6dwqZw0j_jY',
    'http://www.youtube.com/watch?v=6dwqZw0j_jY&feature=youtu.be',
    'http://youtu.be/afa-5HQHiAs',
    'http://www.youtube.com/user/Scobleizer#p/u/1/1p3vcRhsYGo?rel=0',
    'http://www.youtube.com/watch?v=cKZDdG9FTKY&feature=channel',
    'http://www.youtube.com/watch?v=yZ-K7nCVnBI&playnext_from=TL&videos=osPknwzXEas&feature=sub',
    'http://www.youtube.com/ytscreeningroom?v=NRHVzbJVx8I',
    'http://www.youtube.com/embed/nas1rJpm7wY?rel=0',
    'http://www.youtube.com/watch?v=peFZbP64dsU',
    'http://youtube.com/v/dQw4w9WgXcQ?feature=youtube_gdata_player',
    'http://youtube.com/vi/dQw4w9WgXcQ?feature=youtube_gdata_player',
    'http://youtube.com/?v=dQw4w9WgXcQ&feature=youtube_gdata_player',
    'http://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player',
    'http://youtube.com/?vi=dQw4w9WgXcQ&feature=youtube_gdata_player',
    'http://youtube.com/watch?v=dQw4w9WgXcQ&feature=youtube_gdata_player',
    'http://youtube.com/watch?vi=dQw4w9WgXcQ&feature=youtube_gdata_player',
    'http://youtu.be/dQw4w9WgXcQ?feature=youtube_gdata_player'
  ];

  let youtubePlayer = YoutubePlayer();

  for (let i = 0; i < urls.length; ++i) {
      assert.ok(youtubePlayer.isYoutubeLink(urls[i]));
  }
  assert.end();
});
