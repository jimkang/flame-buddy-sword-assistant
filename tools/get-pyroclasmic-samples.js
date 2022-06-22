/* global __dirname, Buffer */

//var responsesById = require('../response-table');
var apiKey = require('../config').ttsAPIKey;
var queue = require('d3-queue').queue;
var waterfall = require('async-waterfall');
var bodyMover = require('request-body-mover');
var curry = require('lodash.curry');
var request = require('request');
var fs = require('fs');

const audioDir = __dirname + '/../audio';
const endpointURL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

var responsesById = {
  sluglike: 'It is a slug-like creature that leaves behind a dangerous trail of fire.',
  stripes: 'They are black in appearance, with stripes of yellow-reddish gradient looping around their body in a pattern resembling that of flowing lava.',
  antennae: 'They have two antennae near the top of their cone-shaped bodies.',
  slime: 'The Pyroclasmic Slooch is also covered in a combustible slime which it leaves behind as it moves.',
  mucus: 'A species of terrestrial snail coated in flammable mucus instead of the traditional shell.',
  fires: 'The creature stays lubricated through constant secretion of mucus so that the fires never reach its skin.',
  plants: 'The most fascinating aspect of these creatures is their instinctive ability to avoid causing widespread fires by carelessly brushing plants.'
}

var q = queue();
Object.keys(responsesById).forEach(queueGet);
q.awaitAll(handleError);

function queueGet(id) {
  q.defer(getAudio, id, responsesById[id]);
}

function getAudio(id, text, done) {
  waterfall([curry(callTTS)(text), curry(saveAudio)(id)], done);
}

function callTTS(text, done) {
  var reqOpts = {
    method: 'POST',
    json: true,
    url: endpointURL + '?key=' + apiKey,
    body: {
      input: { text },
      //voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
      //audioConfig: { audioEncoding: 'OGG_OPUS', speakingRate: 1.0, pitch: 4.0 }
      voice: { languageCode: 'en-US', name: 'en-US-Wavenet-H' },
      audioConfig: { audioEncoding: 'OGG_OPUS', speakingRate: 1.0, pitch: -2.8 }
    }
  };
  request(reqOpts, bodyMover(done));
}

function saveAudio(id, apiResult, done) {
  const path = audioDir + '/' + id + '.ogg';
  fs.writeFile(
    path,
    Buffer.from(apiResult.audioContent, 'base64'),
    { encoding: null },
    done
  );
}

function handleError(error) {
  if (error) {
    console.error(error, error.stack);
  }
}
