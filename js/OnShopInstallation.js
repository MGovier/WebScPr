var onShop = onShop || {};

onShop.installation = function () {
	'use strict';
	var stepStatus, intro;
	function loaded () {
		var button1 = document.getElementById('step1submit');
		stepStatus = document.getElementById('step');
		intro = document.getElementById('intro');
		button1.addEventListener('click', function (e) {
			if (this.form.checkValidity()) {
				e.preventDefault();
				sendForm1(this.form);
				this.form.classList.add('slideOut', 'vanish');
				this.form.classList.remove('slideInFromLeft');
				stepStatus.classList.remove('slideInFromLeft');
				stepStatus.classList.add('slideIn');
				stepStatus.innerHTML = '<p>Ok, testing that out! Please wait...</p>';
			}
		});
	}

	function stage2 (formData) {
		var step2 = document.getElementById('step2');
		step2.classList.add('slideIn');
		step2.classList.remove('vanish');
		var button2 = document.getElementById('step2submit');
		button2.addEventListener('click', function (e) {
			if (this.form.checkValidity()) {
				e.preventDefault();
				formData.append('storeName', document.getElementById('storeName').value);
				formData.append('dbDemo', document.getElementById('dbDemo').checked);
				formData.append('installAddress', window.location.href.split(window.location.host)[1]);
				sendForm2(this.form.action, formData);
				this.form.classList.add('slideOut', 'vanish');
			}
		});
	}

	function done () {
		intro.classList.add('slideIn');
		intro.innerHTML = '<p>Installation complete!</p><p>We hope you enjoy using your new web store, built with valid HTML5, CSS3, PHP and Javascript :-)</p>';
	}

	function sendForm1 (form) {
		var formData = new FormData(form);
		var callback = function (r) {
			var response = JSON.parse(r.target.responseText);
			if (response.success) {
				document.getElementById('step').innerHTML = '<p>Great news! We\'re connected to your database at ' + response.message + '.</p><p>Step 2 of 2: Please fill out these options and we\'re done.</p>';
				stage2(formData);
			} else {
				document.getElementById('step').innerHTML = '<p>Step 1: Blast, we got this error: ' + response.message + ' Please check the details.';
				form.classList.remove('slideOut', 'vanish');
				form.classList.add('slideInFromLeft');
				stepStatus.classList.add('slideInFromLeft');
			}
		};
		var error = function () {
			stepStatus.innerHTML = '<p>It seems parts of the application can\'t be found. Try re-copying your folders!</p>';
		};
		onShop.XHR.load({
				'method': 'POST',
				'url': form.action,
				'data': formData,
				'callbacks': {
					'load': callback,
					'error': error
				}
		});
	}

	function sendForm2 (action, formData) {
		var callback = function (r) {
			var response = JSON.parse(r.target.responseText);
			if (response.success) {
				document.getElementById('step').innerHTML = '<a href="' + window.location.href +'"><button class="slideIn" id="showStore">Take me to my new store!</button></a>';
				done();
			} else {
				document.getElementById('step').innerHTML = '<p>Step 2: Blast, we got this error: ' + response.message + ' Please refresh and start again (sorry).';
			}
		};
		var error = function () {
			stepStatus.innerHTML = '<p>It seems parts of the application can\'t be found. Try re-copying your folders!</p>';
		};
		onShop.XHR.load({
				'method': 'POST',
				'url': action,
				'data': formData,
				'callbacks': {
					'load': callback,
					'error': error
				}
		});
	}

	return {
		loaded: loaded
	};

}();

window.addEventListener('load', onShop.installation.loaded);
