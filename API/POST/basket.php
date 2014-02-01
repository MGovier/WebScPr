<?php 
	require_once("../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	if (empty($_POST["basket_id"]) || empty($_POST["product_id"]) || empty($_POST["action"])) {
		echo '<p class="error">Error! All fields are required.</p>';
		exit();
	}
	$basket_id = $db->real_escape_string($_POST["basket_id"]);
	$product_id = $db->real_escape_string($_POST["product_id"]);
	if (strtolower($_POST["action"]) === "add") {
		if (!($query = $db->stmt_init())) {
			echo '<p class="error">Error! Could not initiate query.</p>';
			exit();
		}
		if ($query->prepare("INSERT INTO BASKETS VALUES (?,?)")) {
			$query->bind_param("si", $basket_id, $product_id);
			$query->execute();
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
			$stock = intval($stockQueryResultRow[0]) -1;
			$stockUpdateQuery = $db->stmt_init();
			$stockUpdateQuery->prepare("UPDATE `onshop663652`.`products` SET `PRODUCT_STOCK` = ? WHERE `products`.`PRODUCT_ID` = ?");
			$stockUpdateQuery->bind_param("ii", $stock, $product_id);
			$stockUpdateQuery->execute();			
		} else {
			echo '<p class="error">Error! Database insertion problem.</p>';
			exit();
		}
	}