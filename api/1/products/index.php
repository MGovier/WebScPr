<?php
	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	if (isset($_GET["sort"])) {
		if (strtolower($_GET["sort"]) === "stockasc") {
			$products = $db->query("SELECT * FROM PRODUCTS ORDER BY PRODUCT_STOCK ASC");	
		}
	} else {
		$products = $db->query("SELECT * FROM PRODUCTS");
	}
	$productsArray = array();
	while ($row = $products->fetch_assoc()) {
		$row["PRODUCT_IMAGE"] = BASE_URL . $row["PRODUCT_IMAGE"];
		$row["PRODUCT_URL"] = BASE_URL . "product.php?id=" . $row["PRODUCT_ID"];
		$productsArray[] = $row;
	}
	echo json_encode($productsArray);
