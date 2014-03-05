<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8"/>	
	<title>OnShop Installer</title>
	<link rel="stylesheet" href="../css/style.css" type="text/css">
	<!-- Icons -->
	<link rel="apple-touch-icon" href="../img/assets/apple-icon-touch.png">
	<link rel="icon" href="../img/assets/favicon.png">
	<!-- Javascript -->
    <script src="../js/OnShopXHR.js"></script>
<style type="text/css">
	form {
		margin: 0 auto;
		width: 40em;
	}

	form caption {
		width: 50%;
		display: inline-block;
	}

	form input {
		width: 100%;
	}

	form button {
		width: 100%;
		background: snow;
	}
</style>
</head>
<body>
<div class="header">
	<div class="container">
		<h1 class="branding-title">On Shop Installation</a></h1>
	</div>
</div>
<div id="content">
<div class="container">
	<div id="feedback" class="vanish"></div>
	<div id="side-options">
		<ul id="options">
		</ul>
	</div>
		<h3 id="feature-title">Cofiguration</h3>
		<form method="POST">
			<fieldset name="core" id="core">
				<caption for="dbAddress">Database IP:</caption>
				<input type="text" id="dbAddress" name="dbAddress" value="127.0.0.1">
				<caption for="dbPort">Database Port:</caption>
				<input type="text" id="dbPort" name="dbPort" value="3306">
				<caption for="dbUser">Database Username:</caption>
				<input type="text" id="dbUser" name="dbUser" value="root">
				<caption for="dbPass">Database Password:</caption>
				<input type="password" id="dbPass" name="dbPass">
			</fieldset>
			<fieldset name="settings">
				<caption for="storeName">Store Name:</caption>
				<input type="text" id="storeName" name="storeName">
				<caption for="dbDemo">Install with demo items?:</caption>
				<input type="checkbox" id="dbDemo" name="dbDemo">	
			</fieldset>
			<button type="submit">Let's go!</button>
		</form>
</div>
	</div>

	<div class="footer">
		<div class="container">
			<p>&copy;<?php echo date('Y');?>  - UP663652 - <a href="http://lesterk.myweb.port.ac.uk/webscrp/2013~14/">WEBSCRP at UoP</a></p>
			<ul>
				<li><a href="../help/">Help</a></li>
			</ul>
		</div>	
	</div>
</body>
</html>

