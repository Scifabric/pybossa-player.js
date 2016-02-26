import test from 'tape';
import PybossaPlayer from '../player';

const containerId = 'player-container';
const html5audioUrl = 'https://raw.githubusercontent.com/PyBossa/pybossa-player.js/master/test/files/audio.mp3';
const html5videoUrl = 'https://raw.githubusercontent.com/PyBossa/pybossa-player.js/master/test/files/video.mp4';

function setUp() {
  const body = document.body;
  body.innerHTML = '';
  const container = document.createElement('div');
  container.setAttribute('id', containerId);
  body.appendChild(container);
}


test('HTML5 player accepts a callback that is fired when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(html5videoUrl, containerId);

  player.onReady(function() {
    assert.pass("Player is ready");
    assert.end();
  });
});

test('HTML5 player can be played when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(html5videoUrl, containerId);

  player.onReady(function() {
    player.play();
    assert.equals(player.paused(), false);
    assert.end();
  });
});

test('HTML5 player can be paused when is playing', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(html5videoUrl, containerId);

  player.onReady(function() {
    player.play();
    assert.equals(player.paused(), false);
    player.pause();
    assert.equals(player.paused(), true);
    assert.end();
  });
});

test('HTML5 player.destroy() removes the player from DOM', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(html5videoUrl, containerId);

  assert.ok(document.getElementsByTagName('video')[0]);

  player.destroy();

  assert.notOk(document.getElementsByTagName('video')[0]);
});

test('HTML5 player.duration() returns duration when ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(html5videoUrl, containerId);

  player.onReady(function() {
    assert.equals(player.duration(), 3.787755);
    assert.end();
  });
});

test('HTML5 player.duration() returns 0 when not ready', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(html5videoUrl, containerId);

  assert.equals(player.duration(), 0);
});

test('HTML5 player.setCurrentTime(n) sets playback time to second n', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(html5videoUrl, containerId);

  player.onReady(function() {
    player.setCurrentTime(2);
    assert.equals(player.currentTime(), 2);
    assert.end();
  });
});

test('HTML5 player.ended() returns false if not ended', (assert) => {
  setUp();
  assert.plan(1);
  const player = PybossaPlayer(html5videoUrl, containerId);

  player.onReady(function() {
    assert.equals(player.ended(), false);
    assert.end();
  });
});

test('HTML5 player.onEnded() accepts a callback executed when ended', (assert) => {
  setUp();
  assert.plan(2);
  const player = PybossaPlayer(html5videoUrl, containerId);

  player.onReady(function() {
    player.onEnded(function() {
      assert.pass("player ended");
      assert.equals(player.ended(), true);
      assert.end();
    });
    player.setCurrentTime(3.75);
    player.play();
  });
});
