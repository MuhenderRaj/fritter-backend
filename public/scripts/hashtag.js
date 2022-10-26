/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function getHashtags(fields) {
  fetch(`/api/hashtags/${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function addHashtag(fields) {
  fetch(`/api/hashtags/${fields.freetId}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteHashtag(fields) {
  fetch(`/api/hashtags/${fields.freetId}/${fields.hashtag}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
