<?php 
if (!file_exists("inc/config.php")) {
	include("inc/install/installer.php");
	exit();
}
require_once("inc/config.php");

$pageTitle = "Home";
$section = "home";
include(ROOT_PATH . 'inc/header.php'); ?>

<section class="container">
	<section id="feedback" class="vanish">
	</section>
	<section id="side-options">
		<ul id="options">
		</ul>
		<ul id="basket">
			<li>
				<p>No Products in Basket.</p>
				<p>Why not buy some stuff?!</p>
			</li>
		</ul>
	</section>
		<h3 id="feature-title">New Products</h3>
		<section id="dynamic-content">
    	</section>
</section>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>