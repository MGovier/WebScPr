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
	<div class="sideoptions">
	</div>
	<div class="dynamic-content">
		<h3 id="feature-title">Product Loading</h3>
		<script type="text/javascript">
			OnShop.functions.showProduct(<?php echo $product_id; ?>);
		</script>
	</div>
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>




