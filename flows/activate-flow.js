var mediaPlayer = document.getElementById('media-player');
var fbsaImageActive = document.getElementById('fbsa-image-active');
var fbsaImageError = document.getElementById('fbsa-image-error');
var probable = require('probable');
var tableDef = require('../random-response-table-def');
var errorResponseIds = require('../error-response-ids');

var randomResponseTable = probable.createTableFromSizes(tableDef);

mediaPlayer.addEventListener('ended', hideAnimations);

function activateFlow() {
  var responseId = randomResponseTable.roll();
  mediaPlayer.pause();
  hideAnimations();
  mediaPlayer.src = `audio/${responseId}.ogg`;
  mediaPlayer.play();

  animateFBSAImage(responseId);

  // Huh, not really much "flow" here, eh?
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
