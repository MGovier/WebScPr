<?php 

require_once("inc/config.php");

$pageTitle = "Home";
$section = "home";
include(ROOT_PATH . 'inc/header.php'); ?>

<div class="container">
	<div id="sideoptions">
		<ul>
			<?php 
				include(ROOT_PATH . "inc/db/database.php");
	    		include(ROOT_PATH . "inc/db/insert-demo-products.php");
	    		insert_demo_data($db);
    		?>
		</ul>
	</div>
		<h3 id="feature-title">New Products</h3>
<!-- 		<div class="pagination">
			<span>1</span>
			<a href="./?pg=2">2</a>
			<a href="./?pg=3">3</a>
			<a href="./?pg=4">4</a>								
		</div> -->
		<div id="dynamic-content">
		<script type="text/javascript">
		window.addEventListener('load', OnShop.functions.pageLoaded);
		</script>
    	</div>
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>