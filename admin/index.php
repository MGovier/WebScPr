<?php 

require_once("../inc/config.php");

$pageTitle = "Admin";
$section = "adminhome"; ?>
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
    <script src="<?php echo BASE_URL; ?>js/onShopScripts.js"></script>
    <script src="<?php echo BASE_URL; ?>js/onShopXHR.js"></script>
	<script src="<?php echo BASE_URL; ?>admin/onShopAdminScripts.js"></script>
</head>
<body>
<section class="header">
	<div class="container">
		<h1 class="branding-title"><a href="<?php echo BASE_URL; ?>"><?php echo STORE_NAME ?></a></h1>
	</div>
</section>

<section id="content">
<section class="container">
	<section id="feedback" class="vanish"></section>
	<section id="side-options">
		<ul id="options">
			<li id="stockLevels">Manage Items</li>
			<li id="productAddFormToggle">Add an Item</li>
			<li id="manageCategories">Manage Categories</li>
			<li id="addCategoryToggle">Add a Category</li>
			<li id="viewOrders">View Open Orders</li>
			<li id="viewCompleteOrders">View Completed Orders</li>
		</ul>
	</section>
		<h3 id="feature-title">Admin Control</h3>
	<section id="dynamic-content">
    </section>
    		
</section>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>