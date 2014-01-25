<?php 

require_once("../inc/config.php");

$pageTitle = "Admin";
$section = "adminhome";
include(ROOT_PATH . 'inc/header.php'); ?>
<script src="<?php echo BASE_URL; ?>admin/OnShopAdminScripts.js"></script>

<div class="container">
	<div id="sideoptions">
		<ul>
		<li id="stockLevels"><a href="#">View stock levels</a></li>
		<li id="productAddFormToggle"><a href="#">Add an item</a></li>
		</ul>
	</div>
		<h3 id="feature-title">Admin Control</h3>

		<div id="dynamic-content">
    	</div>
    		
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>