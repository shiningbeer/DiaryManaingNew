var request = require('request');

const url_base = 'http://localhost:1978'

var myRequest = (url, param, callback) => {
    mytoken=localStorage.getItem('token')
    request.post({
        url: url,
        json: true,
        headers: {
            "content-type": "application/json",
            'token':mytoken
        },
        body: param
    }, (error, response, body) => {
        error?callback(600,error):callback(response.statusCode,body)            
    }) 
}

