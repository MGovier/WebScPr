<?php 

require_once("inc/config.php");

$pageTitle = "Home";
$section = "home";
include(ROOT_PATH . 'inc/header.php'); ?>

<div class="container">
	<div class="categories">
		<ul>
			<li>Category 1</li>
			<li>Category 2 is a long category</li>
			<li>Cat 3</li>
		</ul>
	</div>
	<div class="wrapper">
		<h3 class="feature-title">New Products</h3>
		<div class="pagination">
			<span>1</span>
			<a href="./?pg=2">2</a>
			<a href="./?pg=3">3</a>
			<a href="./?pg=4">4</a>								
		</div>
		<ul class="products">
	    	<?php
	    		include(ROOT_PATH . "inc/db/database.php");
	    		include(ROOT_PATH . "inc/db/insert-demo-products.php");
	    		insert_demo_data($db);

	    		$products = $db->query("SELECT * FROM PRODUCTS");
	    		while ($row = $products->fetch_assoc()) {
	    			echo '<li>';
	    			echo '<a href ="#">';
	    			echo '<h4>' . $row["PRODUCT_NAME"] . '</h4>';
	    			echo '<img src="' . BASE_URL . $row["PRODUCT_IMAGE"] . '" alt="Product Image">';
	    			echo '<p>' . $row["PRODUCT_DESCRIPTION"] . '</p>';
	    			echo '</li>';
	    		}
	    	?>
    </ul>
	</div>
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>