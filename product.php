<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/663652/OnShop/inc/config.php");

// Check if an ID has been given, then try get it!
if (isset($_GET["id"])) {
	$product_id = intval($_GET["id"]);
}

$pageTitle = "Product";
$section = "product";
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




