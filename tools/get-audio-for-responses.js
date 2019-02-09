/* global __dirname, Buffer */

var responsesById = require('../response-table');
var apiKey = require('../config').ttsAPIKey;
var queue = require('d3-queue').queue;
var waterfall = require('async-waterfall');
var bodyMover = require('request-body-mover');
var curry = require('lodash.curry');
var request = require('request');
var fs = require('fs');

const audioDir = __dirname + '/../audio';
const endpointURL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

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
      voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
      audioConfig: { audioEncoding: 'OGG_OPUS', speakingRate: 0.9 }
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
