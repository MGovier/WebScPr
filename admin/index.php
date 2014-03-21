<?php 

require_once("../inc/config.php");

$pageTitle = "Admin";
$section = "adminhome";
include(ROOT_PATH . 'inc/header.php'); ?>
<script src="<?php echo BASE_URL; ?>admin/onShopAdminScripts.js"></script>

<div class="container">
<div id="feedback" class="vanish"></div>
	<div id="side-options">
		<ul id="options">
			<li id="stockLevels">Manage Items</li>
			<li id="productAddFormToggle">Add an Item</li>
			<li id="manageCategories">Manage Categories</li>
			<li id="addCategoryToggle">Add a Category</li>
			<li id="viewOrders">View Orders</li>
			<li id="viewStats">View Statistics</li>
		</ul>
	</div>
		<h3 id="feature-title">Admin Control</h3>

		<div id="dynamic-content">
    	</div>
    		
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>