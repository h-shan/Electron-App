let $ = require('jquery')  // jQuery now loaded and assigned to $
let fs = require('fs')
let request = require('request')

$('#find-task').on('click', () => {
    let username = $('#Username').val()
    let password = $('#Password').val()
    let project = $('#Project').val()
    queryJIRA(username, password, project)
})

function queryJIRA(username, password, project) {
    try {
      var options = {
        url: 'https://' + project + '.atlassian.net/rest/api/latest/search?jql=project+%3D+DEMO+ORDER+BY+priority+DESC&maxResults=1',
        auth: {
            'user': username,
            'pass': password
        }
      };
    } catch(err) {
      console.log("Error in finding task: " + err)
    }

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
        	body = JSON.parse(body)
        	let issue = body["issues"][0]
          let id = issue["id"]
        	let key = issue["key"]
        	let description = issue["fields"]["issuetype"]["description"]
        	let name = issue["fields"]["issuetype"]["name"]
          addEntry(id, key, description, name)
        }
    }

    request(options, callback)
}
function addEntry(id, key, description, name) {
  if (id && key && description && name) {
    let updateString = '<tr><td>' + id + '</td><td>' + key + '</td><td>' + description + '</td><td>' + name + '</td></tr>'
    $('#task-table').append(updateString)
  }
}
