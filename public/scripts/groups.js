/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function getGroups(fields) {
  fetch('/api/groups')
    .then(showResponse)
    .catch(showResponse);
}
