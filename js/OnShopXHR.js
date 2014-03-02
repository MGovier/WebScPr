// create a namespace for the JS, and ensure nothing is overwritten.
var OnShop = OnShop || {};

// This XHR function is heavily based on Kit Lester & Rich Boakes' Linora project. 
// Thanks!
OnShop.XHR = function () {
	'use strict';

	function encodePayload (data) {
		var i, payload = '';
		for (i in data) {
			payload += i + '=' + encodeURIComponent(data[i]) + '&';
		}
		// remove that pesky last ampersand.
		payload = payload.slice(0, -1);
		return payload;
	}

	function load (r) {
		var i, xhr = new XMLHttpRequest();

		if (!r.method) {r.method = 'GET';}

		xhr.open(r.method, r.url, true);

		if (r.accept) {
			xhr.setRequestHeader('Accept', r.accept);
		} else {
			xhr.setRequestHeader('Accept', 'application/json');
		}

		if (r.args) {
			xhr.onload = function (e) { r.callbacks.load(e, r.args); };
		    xhr.onerror = function (e) { r.callbacks.error(e, r.args); };
		}
		else {
			for (i in r.callbacks) {
				if (r.callbacks.hasOwnProperty(i)) {
					xhr.addEventListener(i, r.callbacks[i]);
				}
			}
		}
		// Posts use FormData, leaving only PATCH to require an encoded payload.
		if (r.method == 'PATCH') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			r.data = encodePayload(r.data);
		}
		xhr.send(r.data);
	}

	return {
		'load': load
	};

}();