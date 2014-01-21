<?php 

require_once("../inc/config.php");

$pageTitle = "Admin";
$section = "adminhome";
include(ROOT_PATH . 'inc/header.php'); ?>
<script src="<?php echo BASE_URL; ?>admin/OnShopAdminScripts.js"></script>

<div class="container">
	<div id="sideoptions">
		<ul>
		<li id="stockLevels">View stock levels</li>
		<li id="productAddFormToggle">Add an item</li>
		</ul>
	</div>
		<h3 id="feature-title">Admin Control</h3>

		<div id="dynamic-content">
    	</div>
    		<form id="addProductForm" class="hidden">
    			<fieldset>
    				<p>
		    			<label for="productName">Product Name:</label>
		    			<input type="text" id="productName" placeholder="Enter product name">
	    			</p>
	    			<p>
		    			<label for="productCategory">Product Category:</label>
		    			<select id="productCategory">
		    				<?php
								// IMPROVE THIS
								include(ROOT_PATH . "inc/db/database.php");
								$categories = $db->query("SELECT * FROM CATEGORIES");
								while ($row = $categories->fetch_assoc()) {
								    echo '<option>' . $row["CATEGORY_NAME"] . '</option>';
								}
							?>
		    			</select>
	    			</p>
	    			<p>
		    			<label for="productImage">Product Image:</label>
		    			<input type="file" id="productImage">
	    			</p>
	    			<p>
		    			<label for="productDescription">Product Description:</label>
		    			<textarea id="productDescription" placeholder="Enter product description"></textarea>
	    			</p>
	    			<p>
		    			<label for="productStock">Enter initial stock:</label>
		    			<input type="number" min="0" id="productStock" placeholder="Enter product stock number">
	    			</p>
    			</fieldset>
			</form>
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>