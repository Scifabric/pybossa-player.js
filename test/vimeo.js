import test from 'tape';
import PybossaPlayer from '../player';

const containerId = 'player-container';
const vimeoUrl = 'http://player.vimeo.com/video/422115';

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

test('Vimeo player accepts a callback that is fired when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    assert.pass("Player is ready");
    assert.end();
    player.destroy();
  });
});

test('Vimeo player.destroy() removes the player from DOM', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(vimeoUrl, containerId);

  assert.ok(document.getElementsByTagName('iframe')[0]);

  player.destroy();

  assert.notOk(document.getElementsByTagName('iframe')[0]);
});

test('Vimeo player.duration() returns duration when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    assert.equals(player.duration(), 9);
    assert.end();
    player.destroy();
  });
});

test('Vimeo player.duration() returns 0 when not ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  assert.equals(player.duration(), 0);
  player.destroy();
});

test('Vimeo player.setCurrentTime(n) sets playback time to second n', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    player.setCurrentTime(2);
    assert.equals(player.currentTime(), 2);
    assert.end();
    player.destroy();
  });
});

test('Vimeo player.ended() returns false if not ended', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    assert.equals(player.ended(), false);
    assert.end();
    player.destroy();
  });
});

test('Vimeo player volume returns new volume after calling setVolume', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    player.setVolume(0.5);
    assert.equals(player.volume(), 0.5);
    assert.end();
    player.destroy();
  });
});

test('Vimeo player muted() after muting and unmuting', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    player.mute();
    assert.equals(player.muted(), true);
    player.unmute();
    assert.equals(player.muted(), false);
    assert.end();
    player.destroy();
  });
});

test('Vimeo player unmute() preserves volume prior to muted state', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    player.setVolume(1);
    player.setVolume(0.5);
    player.mute();
    player.unmute();
    assert.equals(player.volume(), 0.5);
    assert.end();
    player.destroy();
  });
});

test('Vimeo player.onEnded() accepts a callback fired when playback ends', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    player.onEnded(function() {
      assert.pass("player ended");
      assert.end();
      player.destroy();
    });
    player.setCurrentTime(8.99);
    player.play();
  });
});

test('Vimeo player.onPlay() accepts a callback fired when playback starts', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    player.onPlay(function() {
      assert.pass("Play event fired");
      assert.end();
      player.destroy();
    });
    player.play();
  });
});

// test('Vimeo player.onPause() accepts a callback fired when playback pauses', (assert) => {
//   setUp();
//   assert.plan(1);
//   const player = PybossaPlayer(vimeoUrl, containerId);

//   player.onReady(function() {
//     player.onPlay(function () {
//       player.pause();
//     });
//     player.onPause(function() {
//       assert.pass("Pause event fired");
//       assert.end();
//       player.destroy();
//     });
//     player.play();
//   });
// });

test('Vimeo player.onPlayTimeChange() accepts a callback fired when playtime changes', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(vimeoUrl, containerId);

  player.onReady(function() {
    player.onPlayTimeChange(function() {
      assert.pass("PlayTimeChange event fired");
      assert.end();
      player.destroy();
    });
    player.play();
  });
});
