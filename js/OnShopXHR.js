// create a namespace for the JS, and ensure nothing is overwritten.
var OnShop = OnShop || {};

// This XHR function is heavily based off Kit Lester & Rich Boakes's Linora project. 
// Thanks!
OnShop.XHR = function () {
	'use strict';

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
			xhr.onload = function (e) {
		        if (this.status == '200' || this.status == '304') {
		            r.callbacks.load(e, r.args);
		        } else {
		            r.callbacks.error(e, r.args);
		        }
		    };
		}
		else {
			for (i in r.callbacks) {
				if (r.callbacks.hasOwnProperty(i)) {
					xhr.addEventListener(i, r.callbacks[i]);
				}
			}
		}
		xhr.send(r.data);
	}

	return {
		'load': load
	};

}();