/* eslint-disable @typescript-eslint/restrict-template-expressions */
/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function getFeed(fields) {
  console.log('got feed');
  fetch('/api/feed')
    .then(showResponse)
    .catch(showResponse);

  console.log('got feed');
}

function unlockFeed(fields) {
  fetch('/api/feed/unlockFeed', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function approvePost(fields) {
  fetch(`/api/feed/approvePost/${fields.freetId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function newFeed(fields) {
  fetch('/api/feed/newFeed')
    .then(showResponse)
    .catch(showResponse);
}
