<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title><?php echo STORE_NAME . " > " . $pageTitle; ?></title>
	<link rel="stylesheet" href="<?php echo BASE_URL; ?>css/style.css" type="text/css">
	<!-- Icons -->
	<link rel="apple-touch-icon" href="<?php echo BASE_URL; ?>img/apple-icon-touch.png">
	<link rel="icon" href="<?php echo BASE_URL; ?>img/favicon.png">
	<!-- Icon and HTML5 support for older IE -->
	<!--[if IE]>
  		<link rel="shortcut icon" href="<?php echo BASE_URL; ?>img/favicon.ico">
	<![endif]-->
	<!--[if lt IE 9]>
      	<script src="<?php echo BASE_URL; ?>js/html5shiv.js"></script>
    <![endif]-->
    <script src="<?php echo BASE_URL; ?>js/OnShopScripts.js"></script>

</head>
<body>
<div class="header">
	<div class="container">
		<h1 class="branding-title"><a href="<?php echo BASE_URL; ?>"><?php echo STORE_NAME ?></a></h1>
			<ul class="nav">
				<li class="on"><a href="#">Products</a></li>
				<li><a href="#">About</a></li>
			</ul>
			<form method="post" action="search.php" class="searchbar">
				<input type="text" name="search" value="" id="search" placeholder="Search Products">
			</form>		
	</div>
</div>

<div id="content">

