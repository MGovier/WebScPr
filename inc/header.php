<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8"/>	
	<title><?php echo STORE_NAME . " > " . $pageTitle; ?></title>
	<link rel="stylesheet" href="<?php echo BASE_URL; ?>css/style.css" type="text/css">
	<!-- Icons -->
	<link rel="apple-touch-icon" href="<?php echo BASE_URL; ?>img/assets/apple-icon-touch.png">
	<link rel="icon" href="<?php echo BASE_URL; ?>img/assets/favicon.png">
	<!-- Javascript -->
    <script src="<?php echo BASE_URL; ?>js/OnShopScripts.js"></script>
    <script src="<?php echo BASE_URL; ?>js/OnShopXHR.js"></script>

</head>
<body>
<div class="header">
	<div class="container">
		<h1 class="branding-title"><a href="<?php echo BASE_URL; ?>"><?php echo STORE_NAME ?></a></h1>
		<form class="searchbar">
			<input type="search" name="search" id="search" placeholder="Search Products">
		</form>	
	</div>
</div>

<div id="content">

