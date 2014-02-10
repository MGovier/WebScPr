<?php 
	require_once("../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	if (empty($_POST["basket_id"]) || empty($_POST["product_id"]) || empty($_POST["action"])) {
		echo '<p class="error">Error! All fields are required.</p>';
		exit();
	}
	$basket_id = $db->real_escape_string($_POST["basket_id"]);
	$product_id = $db->real_escape_string($_POST["product_id"]);
	// $quantity = $db->real_escape_string($_POST["quantity"]);
	$quantity = 2;
	if (strtolower($_POST["action"]) === "add") {
		if (!($quantityQuery = $db->stmt_init())) {
			echo '<p class="error">Error! Could not initiate query.</p>';
			exit();
		}
		if ($quantityQuery->prepare("SELECT PRODUCT_QUANTITY FROM BASKETS WHERE BASKET_ID = ? AND PRODUCT_ID = ?")) {
			$quantityQuery->bind_param("si", $basket_id, $product_id);
			$quantityQuery->execute();
			$quantityQueryResult = $quantityQuery->get_result();
			if (mysqli_num_rows($quantityQueryResult) === 1) {
				$quantityQueryResultRow = $quantityQueryResult->fetch_row();
				$oldQuantity = intval($quantityQueryResultRow[0]);
				$newQuantity = $oldQuantity + $quantity;
				$quantityUpdateQuery = $db -> stmt_init();
				$quantityUpdateQuery->prepare("UPDATE BASKETS SET PRODUCT_QUANTITY = ? WHERE BASKET_ID = ? AND PRODUCT_ID = ?");
				$quantityUpdateQuery->bind_param("isi", $newQuantity, $basket_id, $product_id);
				$quantityUpdateQuery->execute();
			} else {
				$newProductQuery = $db->stmt_init();
				if ($newProductQuery->prepare("INSERT INTO BASKETS VALUES (?,?,?)")) {
						$newProductQuery->bind_param("sii", $basket_id, $product_id, $quantity);
						$newProductQuery->execute();
					} else {
						echo '<p class="error">Error! Database insertion problem.</p>';
						exit();
					}	
				}	
		} else {
			echo '<p class="error">Error! Database insertion problem.</p>';
			exit();
		} 
		if (!($stockQuery = $db->stmt_init())) {
			echo '<p class="error">Error! Could not initiate query.</p>';
			exit();
		}
		if ($stockQuery->prepare("SELECT PRODUCT_STOCK FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
			$stockQuery->bind_param("i", $product_id);
			$stockQuery->execute();
			$stockQueryResult = $stockQuery->get_result();
			$stockQueryResultRow = $stockQueryResult->fetch_row();
			$stock = intval($stockQueryResultRow[0]) - $quantity;
			$stockUpdateQuery = $db->stmt_init();
			$stockUpdateQuery->prepare("UPDATE `onshop663652`.`products` SET `PRODUCT_STOCK` = ? WHERE `products`.`PRODUCT_ID` = ?");
			$stockUpdateQuery->bind_param("ii", $stock, $product_id);
			$stockUpdateQuery->execute();			
		} else {
			echo '<p class="error">Error! Database insertion problem.</p>';
			exit();
		}
	}