var OnShop = OnShop || {};

OnShop.installation = function () {
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
				sendForm2(this.form.action, formData);
				this.form.classList.add('slideOut', 'vanish');
				intro.classList.add('slideOut', 'vanish');
			}
		});
	}

	function done () {
		intro.classList.remove('slideOut', 'vanish');
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
				form.classList.remove('vanish', 'slideOut');
				form.classList.add('slideIn');
			}
		};
		var error = function () {
			stepStatus.innerHTML = '<p>It seems parts of the application can\'t be found. Try re-copying your folders!</p>';
		};
		OnShop.XHR.load({
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
				document.getElementById('step').innerHTML = '<button class="slideIn" id="showStore">Take me to my new store!</button>';
				done();
			} else {
				document.getElementById('step').innerHTML = '<p>Step 2: Blast, we got this error: ' + response.message + ' Please start again (sorry).';
			}
		};
		var error = function () {
			stepStatus.innerHTML = '<p>It seems parts of the application can\'t be found. Try re-copying your folders!</p>';
		};
		OnShop.XHR.load({
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

window.addEventListener('load', OnShop.installation.loaded);
