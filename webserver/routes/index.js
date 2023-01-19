var express = require('express');
var router = express.Router();
//Fetch doesn't exist on server-side JavaScript, so we impoort a package which implements the functionality.
var fetch = require('node-fetch');
var fs = require('fs');
const { equal } = require('assert');

var loadedFiles = false;

//Make sure to set the redirect URI in the Spotify app you create!
var redirect_uri = 'http://localhost:8888/callback';
var my_client_id = null;
var my_client_secret = null;

var access_token = null;
var refresh_token = null;
var client_uri = 'http://localhost:4200';

function refresh() {
	const params = new URLSearchParams();
	params.append('refresh_token', refresh_token);
	params.append('grant_type', 'refresh_token');

	var headers = {
		'Content-Type':'application/x-www-form-urlencoded',
		'Authorization': 'Basic ' + Buffer.from(my_client_id + ':' + my_client_secret).toString('base64')
	};

	return fetch('https://accounts.spotify.com/api/token', {method: 'POST', body: params, headers: headers}).then(response => {
		if(response.ok) {
			return response.json();
		} else {
			throw "Error refreshing token";
		}
	}).then(json => {
		access_token = json.access_token;
		refresh_token = json.refresh_token;
		fs.writeFile('tokens.json', JSON.stringify({access_token: access_token, refresh_token: refresh_token}), () => {
			return Promise.resolve();
		});
	}).catch(err => console.error(err));
}

function makeAPIRequestPlayBack(url, res,id,offset) {
	var headers = {
		'Content-Type':'application/x-www-form-urlencoded',
		'Authorization': 'Bearer ' + access_token
	};

	var data ={
		'context_uri': id,
		'offset': {
			'position': offset
		  }
		
		
	};

	fetch(url, {method: 'PUT', headers: headers, body: JSON.stringify(data)}).then(response => {
		if(response.ok) {
			
			return response.json();
		} else {
			if(response.status == 401) {
				refresh().then(() => {
					return fetch(url, {method: 'PUT', headers: headers, body: data}).then(response => {
						if(response.ok) {
							
							return response.json();
						} else {
							console.log(response);
							res.status(response.status).end();
						}
					});
				});
			} else {
				console.log(response);
				res.status(response.status).end();
			}
			return null;
		}
	}).then(json => {
		res.json(json);
	}).catch(err => {
		console.error(err);
		res.end();
	});
}

function makeAPIRequest(url, res, request) {
	var headers = {
		'Content-Type':'application/x-www-form-urlencoded',
		'Authorization': 'Bearer ' + access_token
	};

	fetch(url, {method: request, headers: headers}).then(response => {
		if(response.ok) {
		
			return response.json();
		} else {
			if(response.status == 401) {
				refresh().then(() => {
					return fetch(url, {method: request, headers: headers}).then(response => {
						if(response.ok) {
							
							return response.json();
						} else {
							console.log(response);
							res.status(response.status).end();
						}
					});
				});
			} else {
				console.log(response);
				res.status(response.status).end();
			}
			return null;
		}
	}).then(json => {
		res.json(json);

	}).catch(err => {
		console.error(request);
		console.error(err);
		res.end();
	});
}

router.get('*', function(req, res, next) {
	if(!loadedFiles) {
		//This chains two promises together. First, client_secret.json will be read and parsed. Once it completes, tokens.json will be read and parsed.
		//Promise.all() could be used to conduct these two file reads asynchronously, which is more efficient.
		fs.readFile('client_secret.json', (err, data) => {
			data = JSON.parse(data);
			my_client_id = data.client_id;
			my_client_secret = data.client_secret;
			fs.readFile('tokens.json', (err, data) => {
			data = JSON.parse(data);
			access_token = data.access_token;
			refresh_token = data.refresh_token;
			next();
			});
		});
	}
	else {
		next();
	}
});


router.get('/login', function(req, res, next) {
	var scopes = 'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state' ;
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=code' +
	  '&client_id=' + my_client_id +
	  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  '&redirect_uri=' + encodeURIComponent(redirect_uri));

});


router.get('/callback', function(req, res, next) {
	var code = req.query.code || null;
	var error = req.query.error || null;

	if(error) {
		console.error(error);
	} else {
		//we're probably good
		const params = new URLSearchParams();
		params.append('code', code);
		params.append('redirect_uri', redirect_uri);
		params.append('grant_type', 'authorization_code');

		var headers = {
			'Content-Type':'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + Buffer.from(my_client_id + ':' + my_client_secret).toString('base64')
		};

		fetch('https://accounts.spotify.com/api/token', {method: 'POST', body: params, headers: headers}).then(response => {
			if(response.ok) {
				return response.json();
			} else {
				//Could be better to redirect to an error page, but we'll go back to the client.
				res.redirect(client_uri);
			}

		}).then(json => {
			access_token = json.access_token;
			refresh_token = json.refresh_token;
			fs.writeFile('tokens.json', JSON.stringify({access_token: access_token, refresh_token: refresh_token}), () => {
				res.redirect(client_uri);
			});
		}).catch(err => console.error(err));
	}
});

router.put('/me/player/play/:deviceId', function(req,res,next){
	var deviceId = req.params.deviceId;

	console.log("url is " + req.body.context_uri);
	if(req.body.context_uri === undefined){
		console.log("resume!!");
		makeAPIRequest('https://api.spotify.com/v1/me/player/play?device_id='+ deviceId, res, 'PUT');
		
	}else{

		var albumId = req.body.context_uri;
		var offset = req.body.offset;

		if(offset != 0){
			offset = offset - 1;
		}
		
		console.log("offset is " + offset);
		console.log("start!!");
		makeAPIRequestPlayBack('https://api.spotify.com/v1/me/player/play?device_id='+ deviceId, res, albumId, offset);

	}
	
});

router.put('/me/player/pause/:deviceId', function(req,res,next){
	var deviceId = req.params.deviceId;
	makeAPIRequest('https://api.spotify.com/v1/me/player/pause?device_id='+deviceId, res, 'PUT');
});

router.put('/me/player/volume/:volume', function(req,res,next){
	var volume = req.params.volume;
	makeAPIRequest('https://api.spotify.com/v1/me/player/volume?volume_percent='+volume, res, 'PUT');
});

router.post('/me/player/next/:deviceId', function(req,res,next){
	var deviceId = req.params.deviceId;
	makeAPIRequest('https://api.spotify.com/v1/me/player/next?device_id='+deviceId, res, 'POST' );
});

router.post('/me/player/previous/:deviceId', function(req,res,next){
	var deviceId = req.params.deviceId;
	makeAPIRequest('https://api.spotify.com/v1/me/player/previous?device_id='+deviceId, res, 'POST' );
});

router.post('/me/player/queue/:trackId', function(req,res,next){
	var trackId = "spotify:track:" + req.params.trackId;
	makeAPIRequest('https://api.spotify.com/v1/me/player/queue?uri='+trackId,res,'POST');
});

router.get('/me/player/queue/:deviceId', function(req, res, next){
	var deviceId = req.params.deviceId;
	makeAPIRequest('https://api.spotify.com/v1/me/player/queue?device_id='+deviceId, res,'GET');
});

router.get('/me/player/currently-playing', function(req,res,next){
	makeAPIRequest('https://api.spotify.com/v1/me/player/currently-playing',res,'GET');
});

router.get('/me', function(req, res, next) {
	
	makeAPIRequest('https://api.spotify.com/v1/me', res, 'GET' );
});

router.get('/me/player',function(req,res,next){

	makeAPIRequest('https://api.spotify.com/v1/me/player', res, 'GET');
});

router.get('/search/:category/:resource', function(req, res, next) {
	var resource = req.params.resource;
	var category = req.params.category;
	var params = new URLSearchParams();
	params.append('q', resource);
	params.append('type', category);
	makeAPIRequest('https://api.spotify.com/v1/search?' + params, res , 'GET');
});

router.get('/artist/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/artists/' + id, res, 'GET');
});

router.get('/artist-related-artists/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/artists/' + id + '/related-artists', res ,'GET');
});

router.get('/artist-albums/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/artists/' + id + '/albums', res, 'GET');
});

router.get('/artist-top-tracks/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=US', res, 'GET');
});

router.get('/album/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/albums/' + id, res, 'GET');
});

router.get('/album-tracks/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/albums/' + id + '/tracks', res, 'GET');
});

router.get('/track/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/tracks/' + id, res, 'GET');
});

router.get('/track-audio-features/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/audio-features/' + id, res, 'GET');
});




module.exports = router;
