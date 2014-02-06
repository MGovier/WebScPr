<?php 

require_once("inc/config.php");
$pageTitle = "Home";
$section = "home";
include(ROOT_PATH . 'inc/header.php'); ?>

<div class="container">
	<div id="sideoptions">
	</div>
		<h3 id="feature-title">My Basket</h3>
		<div id="dynamic-content">
		<script type="text/javascript">
		window.addEventListener('load', OnShop.functions.manageBasket);
		</script>
    	</div>
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>