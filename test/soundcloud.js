import test from 'tape';
import PybossaPlayer from '../player';

const containerId = 'player-container';
const soundcloudUrl = 'https://soundcloud.com/henry-saiz/the-labyrinth-17-roots-of';

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


test('Soundcloud player accepts a callback that is fired when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    assert.pass("Player is ready");
    assert.end();
    player.destroy();
  });
});

test('Soundcloud player.destroy() removes the player from DOM', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    assert.ok(document.getElementsByTagName('iframe')[0]);

    player.destroy();

    assert.notOk(document.getElementsByTagName('iframe')[0]);
  });
});

test('Soundcloud player.duration() returns duration when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    assert.equals(player.duration(), 4917.228);
    assert.end();
    player.destroy();
  });
});

test('Soundcloud player.duration() returns 0 when not ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  assert.equals(player.duration(), 0);
  player.destroy();
});

test('Soundcloud player.setCurrentTime(n) sets playback time to second n', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    player.setCurrentTime(2);
    assert.equals(player.currentTime(), 2);
    assert.end();
    player.destroy();
  });
});

test('Soundcloud player.ended() returns false if not ended', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    assert.equals(player.ended(), false);
    assert.end();
    player.destroy();
  });
});

test('Soundcloud player volume returns new volume after calling setVolume', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    player.setVolume(0.5);
    assert.equals(player.volume(), 0.5);
    assert.end();
    player.destroy();
  });
});

test('Soundcloud player muted() after muting and unmuting', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    player.mute();
    assert.equals(player.muted(), true);
    player.unmute();
    assert.equals(player.muted(), false);
    assert.end();
    player.destroy();
  });
});

test('Soundcloud player unmute() preserves volume prior to muted state', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

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

test('Soundcloud player.onEnded() accepts a callback fired when playback ends', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    player.onEnded(function() {
      assert.pass("player ended");
      assert.equals(player.ended(), true);
      assert.end();
      player.destroy();
    });
    player.onPlay(function() {
      player.setCurrentTime(4917.2);
    });
    player.play();
  });
});

test('Soundcloud player.onPlay() accepts a callback fired when playback starts', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    player.onPlay(function() {
      assert.pass("Play event fired");
      assert.end();
      player.destroy();
    });
    player.play();
  });
});

test('Soundcloud player.onPause() accepts a callback fired when playback pauses', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    player.onPause(function() {
      assert.pass("Pause event fired");
      assert.end();
      player.destroy();
    });
    player.play();
    player.pause();
  });
});

test('Soundcloud player.onPlayTimeChange() accepts a callback fired when playtime changes', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(soundcloudUrl, containerId);

  player.onReady(function() {
    player.onPlayTimeChange(function() {
      assert.pass("PlayTimeChange event fired");
      assert.end();
      player.destroy();
    });
    player.play();
  });
});
