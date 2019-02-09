var handleError = require('handle-error-web');
var activateButton = document.getElementById('activate-button');
var activateFlow = require('./flows/activate-flow');

(function go() {
  window.onerror = reportTopLevelError;
  activateButton.addEventListener('click', activateFlow);
})();

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
