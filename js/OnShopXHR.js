/**
	XHR function for AJAX requests throughout the project.
	Heavily based on Kit Lester and Rich Boakes' Linora project (https://github.com/portsoc/linora). Thanks!

	@author UP663652
*/

// create a namespace for the JS, and ensure nothing is overwritten.
var onShop = onShop || {};

onShop.XHR = function () {
	// Strict mode helps ensure code correctness.
	'use strict';

	/** Encode data as a application/x-www-form-urlencoded. Used where FormData is not appropriate. */
	function encodePayload (data) {
		var i, payload = '';
		for (i in data) {
			payload += i + '=' + encodeURIComponent(data[i]) + '&';
		}
		// remove that pesky last ampersand.
		payload = payload.slice(0, -1);
		return payload;
	}

	/** XHR loading function. Uses an object as a parameter, which can contain the following settings.
		Defaults are used if not specified for some optional parameters.
		-method (default GET)
		-accept (default JSON)
		-callbacks 
		-url (required)
	*/
	function load (r) {
		var i, xhr = new XMLHttpRequest();

		if (!r.method) {r.method = 'GET';}

		xhr.open(r.method, r.url, true);

		if (r.accept) {
			xhr.setRequestHeader('Accept', r.accept);
		} else {
			xhr.setRequestHeader('Accept', 'application/json');
		}

		// Passed arguments are awkward, having to manually pass them to the right places...
		if (r.args) {
			xhr.onload = function (e) { r.callbacks.load(e, r.args); };
		    xhr.onerror = function (e) { r.callbacks.error(e, r.args); };
		}
		// If we don't have to deal with arguments, can interate through all callbacks attached to object.
		// Then attach themself to the event listener of their property name. Neat!
		else {
			for (i in r.callbacks) {
				if (r.callbacks.hasOwnProperty(i)) {
					xhr.addEventListener(i, r.callbacks[i]);
				}
			}
		}
		// POSTs use FormData, leaving only PATCH to require an encoded payload.
		if (r.method == 'PATCH') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			r.data = encodePayload(r.data);
		}
		xhr.send(r.data);
	}

	// Return methods to be accessible from other scripts.
	return {
		'load': load
	};

// Closing () makes the function called straight away.
}();