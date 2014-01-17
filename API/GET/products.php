<?php
	require_once($_SERVER["DOCUMENT_ROOT"] . "/663652/OnShop/inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	include(ROOT_PATH . "inc/db/insert-demo-products.php");
	insert_demo_data($db);
	$products = $db->query("SELECT * FROM PRODUCTS");
	$productsArray = array();
	while ($row = $products->fetch_assoc()) {
		$row["PRODUCT_IMAGE"] = BASE_URL . $row["PRODUCT_IMAGE"];
		$row["PRODUCT_URL"] = BASE_URL . "product.php?id=" . $row["PRODUCT_ID"];
		$productsArray[] = $row;
	}
	echo json_encode($productsArray);
?>