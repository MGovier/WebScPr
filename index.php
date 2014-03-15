<?php 
if (!file_exists("inc/config.php")) {
	include("inc/install/installer.php");
	exit();
}
require_once("inc/config.php");

$pageTitle = "Home";
$section = "home";
include(ROOT_PATH . 'inc/header.php'); ?>

<div class="container">
	<div id="feedback" class="vanish"></div>
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