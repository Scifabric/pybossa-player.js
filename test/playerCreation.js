import test from 'tape';
import PybossaPlayer from '../player';

const containerId = 'player-container';
const html5audioUrl = 'https://raw.githubusercontent.com/PyBossa/pybossa-player.js/master/test/files/audio.mp3';
const html5videoUrl = 'https://raw.githubusercontent.com/PyBossa/pybossa-player.js/master/test/files/video.mp4';
const vimeoUrl = 'http://player.vimeo.com/video/422115';
const youtubeUrl = 'https://www.youtube.com/watch?v=M4TH8rU8wZw';
const soundcloudUrl = 'https://soundcloud.com/henry-saiz/the-labyrinth-17-roots-of';

function setUp() {
  const body = document.body;
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

test('HTML5 player is created and inserted into DOM', (assert) => {
  setUp();

  const player = PybossaPlayer(html5videoUrl, containerId);

  const videoElement = document.getElementsByTagName('video')[0];

  assert.ok(videoElement, "Video element found");
  const containsUrl = videoElement.src.indexOf(html5videoUrl) !== -1;
  assert.ok(containsUrl);

  assert.end();
  player.destroy();
});

test('HTML5 audio player is created if audio option set to true', (assert) => {
  setUp();

  const player = PybossaPlayer(html5audioUrl, containerId, true);

  const audioElement = document.getElementsByTagName('audio')[0];

  assert.ok(audioElement, "Audio element found");
  const containsUrl = audioElement.src.indexOf(html5audioUrl) !== -1;
  assert.ok(containsUrl);

  assert.end();
  player.destroy();
});

test('Vimeo player is created when passed a Vimeo url', (assert) => {
  setUp();
  const player = PybossaPlayer(vimeoUrl, containerId);
  const expectedIframeSrcUrl = vimeoUrl.replace('http', 'https') + '?api=1&player_id=';
  const vimeoIframe = document.getElementsByTagName('iframe')[0];

  assert.ok(vimeoIframe, "Vimeo iframe found");
  assert.ok(vimeoIframe.src.indexOf(expectedIframeSrcUrl) !== -1);
  assert.end();
  player.destroy();
});

test('Youtube player is created when passed a Youtube url', (assert) => {
  setUp();
  assert.plan(1);

  const player = PybossaPlayer(youtubeUrl, containerId);
  player.onReady(function () {
    const youtubeIframe = document.getElementsByTagName('iframe')[0];

    assert.ok(youtubeIframe, "Youtube iframe found");
    assert.end();
    player.destroy();
  });
});

test('Soundcloud player is created when passed a Soundcloud url', (assert) => {
  setUp();

  const expectedIframeSrcUrl = 'https://w.soundcloud.com/player/?url=' + soundcloudUrl;
  assert.plan(2);

  const player = PybossaPlayer(soundcloudUrl, containerId);
  player.onReady(function () {
    const soundcloudIframe = document.getElementsByTagName('iframe')[0];

    assert.ok(soundcloudIframe, "Soundcloud iframe found");
    assert.equals(soundcloudIframe.src, expectedIframeSrcUrl);
    assert.end();
    player.destroy();
  });
});
