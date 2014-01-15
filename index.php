<?php 

require_once("inc/config.php");

$pageTitle = "Home";
$section = "home";
include(ROOT_PATH . 'inc/header.php'); ?>

<div class="container">
	<div class="categories">
		<ul>
			<?php 
				include(ROOT_PATH . "inc/db/database.php");
	    		include(ROOT_PATH . "inc/db/insert-demo-products.php");
	    		insert_demo_data($db);

	    		$categories = $db->query("SELECT * FROM CATEGORIES");
	    		while ($row = $categories->fetch_assoc()) {
	    			echo '<li>' . $row["CATEGORY_NAME"] . '</li>';
	    		}
    		?>
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
		<ul id="products">
    </ul>
	</div>
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>