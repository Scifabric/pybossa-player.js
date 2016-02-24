import test from 'tape';
import PybossaPlayer from './player';

const containerId = 'player-container';
const html5audioUrl = 'http://www.myserver.com/myfile.mp3';
const html5videoUrl = 'https://dl.dropboxusercontent.com/s/8xsu374ulh7huqi/test1.mp4';
const vimeoUrl = 'http://player.vimeo.com/video/422115';
const youtubeUrl = 'https://www.youtube.com/watch?v=M4TH8rU8wZw';
const soundcloudUrl = 'https://soundcloud.com/henry-saiz/the-labyrinth-17-roots-of';

test('HTML5 player is created and inserted into DOM', (assert) => {
  const body = document.body;
  body.innerHTML = '';
  const container = document.createElement('div');
  container.setAttribute('id', containerId);
  body.appendChild(container);

  const player = PybossaPlayer(html5videoUrl, containerId);

  const videoElement = document.getElementsByTagName('video')[0];

  assert.ok(videoElement, "Video element found");
  assert.equals(videoElement.src, html5videoUrl);

  assert.end();
});

test('HTML5 audio player is created if audio option set to true', (assert) => {
  const body = document.body;
  body.innerHTML = '';
  const container = document.createElement('div');
  container.setAttribute('id', containerId);
  body.appendChild(container);

  const player = PybossaPlayer(html5audioUrl, containerId, true);

  const audioElement = document.getElementsByTagName('audio')[0];

  assert.ok(audioElement, "Audio element found");
  assert.equals(audioElement.src, html5audioUrl);

  assert.end();
});

test('Vimeo player is created when passed a Vimeo url', (assert) => {
  const body = document.body;
  body.innerHTML = '';
  const container = document.createElement('div');
  container.setAttribute('id', containerId);
  body.appendChild(container);
  const expectedIframeSrcUrl = vimeoUrl.replace('http', 'https') + '?api=1';

  const player = PybossaPlayer(vimeoUrl, containerId);

  const vimeoIframe = document.getElementsByTagName('iframe')[0];

  assert.ok(vimeoIframe, "Vimeo iframe found");
  assert.equals(vimeoIframe.src, expectedIframeSrcUrl);

  assert.end();
});

test('Youtube player is created when passed a Youtube url', (assert) => {
  const body = document.body;
  body.innerHTML = '';
  const fakeScript = document.createElement('script');
  const container = document.createElement('div');
  container.setAttribute('id', containerId);
  body.appendChild(container);
  body.appendChild(fakeScript);
  assert.plan(1);

  const player = PybossaPlayer(youtubeUrl, containerId);
  player.onReady(function () {
    const youtubeIframe = document.getElementsByTagName('iframe')[0];

    assert.ok(youtubeIframe, "Youtube iframe found");
    assert.end();
  });
});

test('Soundcloud player is created when passed a Soundcloud url', (assert) => {
  const body = document.body;
  body.innerHTML = '';
  const fakeScript = document.createElement('script');
  const container = document.createElement('div');
  container.setAttribute('id', containerId);
  body.appendChild(container);
  body.appendChild(fakeScript);

  const expectedIframeSrcUrl = 'https://w.soundcloud.com/player/?url=' + soundcloudUrl;
  assert.plan(2);

  const player = PybossaPlayer(soundcloudUrl, containerId);
  player.onReady(function () {
    const soundcloudIframe = document.getElementsByTagName('iframe')[0];

    assert.ok(soundcloudIframe, "Soundcloud iframe found");
    assert.equals(soundcloudIframe.src, expectedIframeSrcUrl);
    assert.end();
  });
});
