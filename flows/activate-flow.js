var probable = require('probable');
var tableDef = require('../random-response-table-def');
var errorResponseIds = require('../error-response-ids');
var playAudioURL = require('play-audio-url');
var handleError = require('handle-error-web');
var sb = require('standard-bail')();

var randomResponseTable = probable.createTableFromSizes(tableDef);
var fbsaImageActive = document.getElementById('fbsa-image-active');
var fbsaImageError = document.getElementById('fbsa-image-error');

function activateFlow() {
  var responseId = randomResponseTable.roll();
  hideAnimations();
  playAudioURL(
    { url: `audio/${responseId}.mp3` },
    sb(getReadyForEnd, handleError)
  );
  animateFBSAImage(responseId);

  function getReadyForEnd({ htmlPlayer }) {
    if (htmlPlayer) {
      htmlPlayer.removeEventListener('ended', hideAnimations);
      htmlPlayer.addEventListener('ended', hideAnimations);
    } else {
      // Fake it.
      setTimeout(hideAnimations, 5000);
    }
  }
}

function animateFBSAImage(responseId) {
  if (errorResponseIds.indexOf(responseId) === -1) {
    fbsaImageActive.classList.remove('hidden');
  } else {
    fbsaImageError.classList.remove('hidden');
  }
}

function hideAnimations() {
  // Stop showing animations.
  fbsaImageError.classList.add('hidden');
  fbsaImageActive.classList.add('hidden');
}

module.exports = activateFlow;
