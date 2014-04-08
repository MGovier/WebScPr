<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8"/>	
	<title>OnShop Installer</title>
	<link rel="stylesheet" href="css/style.css" type="text/css">
	<link rel="stylesheet" href="css/installer.css" type="text/css">
	<!-- Icons -->
	<link rel="apple-touch-icon" href="img/assets/apple-icon-touch.png">
	<link rel="icon" href="img/assets/favicon.png">
	<!-- Javascript -->
    <script src="js/onShopXHR.js"></script>
    <script src="js/onShopInstallation.js"></script>
</head>
<body>
<div class="header">
	<div class="container">
		<h1 class="branding-title">On Shop Installation</h1>
	</div>
</div>
<div id="content">
<div class="container">
	<div id="feedback" class="vanish"></div>
	<div id="side-options">
		<ul id="options">
		</ul>
	</div>
		<h3 id="feature-title">Configuration</h3>
		<div id="intro">
			<p>Welcome to <span id="brand">OnShop</span>, your new content management system!</p> 
			<p>Please follow the stages below, and we'll tell you if there are any problems - if you're unsure, consult your manual.</p>
		</div>
		<div id="step">
			<p>Step 1 of 2: Let's try and connect to your MySQL database.</p>
		</div>
		<div class="forms">
			<form id="step1" method="POST" action="inc/db/">
				<fieldset name="core" id="core">
					<label for="dbAddress">Database IP:</label>
					<input type="text" id="dbAddress" name="dbAddress" pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$" value="127.0.0.1">
					<label for="dbPort">Database Port:</label>
					<input type="text" id="dbPort" name="dbPort" pattern="^[0-9]+$" value="3306">
					<label for="dbUser">Database Username:</label>
					<input type="text" id="dbUser" name="dbUser" value="root">
					<label for="dbPass">Database Password:</label>
					<input type="password" id="dbPass" name="dbPass">
				</fieldset>
				<button id="step1submit" type="submit">Let's go!</button>
			</form>
			<form id="step2" class="vanish" method="POST" action="inc/install/install.php">
				<fieldset name="settings">
					<label for="storeName">Store Name:</label>
					<input type="text" id="storeName" name="storeName" maxlength="30" required>
					<label for="dbDemo">Install with demo items?</label>
					<input type="checkbox" id="dbDemo" name="dbDemo" checked>	
				</fieldset>
				<button id="step2submit" type="submit">Submit!</button>
			</form>
		</div>
</div>
</div> 
	<div class="footer">
		<div class="container">
			<p>&copy; <?php echo date('Y');?>  - UP663652 - <a href="http://lesterk.myweb.port.ac.uk/webscrp/2013~14/">WEBSCRP at UoP</a></p>
			<ul>
				<li><a href="../help/">Help</a></li>
			</ul>
		</div>	
	</div>
</body>
</html>
