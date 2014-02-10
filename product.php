<?php
require_once("/inc/config.php");

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




