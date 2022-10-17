/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function getReactions(fields) {
  fetch(`/api/reactions?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function addReaction(fields) {
  fetch(`/api/reactions?freetId=${fields.freetID}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function changeReaction(fields) {
  fetch(`/api/reactions?freetId=${fields.freetID}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteReaction(fields) {
  fetch(`/api/reactions?freetId=${fields.freetID}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
