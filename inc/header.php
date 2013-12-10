<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title><?php echo STORE_NAME . " > " . $pageTitle; ?></title>
	<link rel="stylesheet" href="<?php echo BASE_URL; ?>css/style.css" type="text/css">
	<!-- Icons -->
	<link rel="apple-touch-icon" href="img/apple-icon-touch.png">
	<link rel="icon" href="img/favicon.png">
	<!--[if IE]>
  		<link rel="shortcut icon" href="img/favicon.ico">
	<![endif]-->
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
				<input type="text" name="search" value="" id="search" placeholder="Search" required>
			</form>		
	</div>
</div>

<div id="content">

