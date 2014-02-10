<?php 

require_once("inc/config.php");

// Make a setup script already
include(ROOT_PATH . "inc/db/database.php");
include(ROOT_PATH . "inc/db/insert-demo-products.php");
insert_demo_data($db);

$pageTitle = "Home";
$section = "home";
include(ROOT_PATH . 'inc/header.php'); ?>

<div class="container">
	<div id="side-options">
		<ul id="options">
		</ul>
		<ul id="basket">
			<li>
				<p>No Products in Basket.</p>
				<p>Why not buy some stuff?!</p>
			</li>
		</ul>
	</div>
		<h3 id="feature-title">New Products</h3>
		<div id="dynamic-content">
    	</div>
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>