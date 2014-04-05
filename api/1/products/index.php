<?php
/*
	API for Multiple Products
	Supports: 
		GET - Retrieve the details of all products. Returns JSON object. 
				Sort can be specified as stockAsc only at present.

	@author UP663652
*/

	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	switch ($_SERVER["REQUEST_METHOD"]) {
		case 'GET':
			if (isset($_GET["sort"])) {
				// Case-insensitivity.
				if (strtolower($_GET["sort"]) === "stockasc") {
					$products = $db->query("SELECT * FROM PRODUCTS ORDER BY PRODUCT_STOCK ASC");	
				}
			} else {
				$products = $db->query("SELECT * FROM PRODUCTS");
			}
			$productsArray = array();
			// Attach the BASE URL to the product images and URLs from the config file.
			while ($row = $products->fetch_assoc()) {
				$row["PRODUCT_IMAGE"] = BASE_URL . $row["PRODUCT_IMAGE"];
				$row["PRODUCT_URL"] = BASE_URL . "product.php?id=" . $row["PRODUCT_ID"];
				$productsArray[] = $row;
			}
			echo json_encode($productsArray);
			break;
		
		default:
			header ("HTTP/1.1 405 Method Not Allowed");
			break;
	}
