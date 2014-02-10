<?php
	require_once("../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	if (isset($_GET["basket_id"])) {
		$basketID = $db->real_escape_string($_GET["basket_id"]);
		$basketQuery = $db->stmt_init();
		if ($basketQuery->prepare("SELECT * FROM BASKETS WHERE BASKET_ID = ?")) {
			$basketQuery->bind_param("s", $basketID);
			$basketQuery->execute();
			$basketQueryResult = $basketQuery->get_result();
			mysqli_stmt_close($basketQuery);
			if (mysqli_num_rows($basketQueryResult) === 0) {
					header("HTTP/1.1 204 No Content");
					exit();
				} else {
					$productsArray = array();
					while ($row = $basketQueryResult->fetch_assoc()) {
						$productsDetails = array();
						$productsDetails["PRODUCT_ID"] = $row["PRODUCT_ID"];
						$productsDetails["PRODUCT_QUANTITY"] = $row["PRODUCT_QUANTITY"];
						$rowQuery = $db->query("SELECT * FROM PRODUCTS WHERE PRODUCT_ID =" . $row["PRODUCT_ID"]);
						$rowQueryResult = $rowQuery->fetch_assoc();
						$productsDetails["PRODUCT_PRICE"] = floatval($rowQueryResult["PRODUCT_PRICE"]);
						$productsDetails["PRODUCT_IMAGE"] = $rowQueryResult["PRODUCT_IMAGE"];
						$productsDetails["PRODUCT_NAME"] = $rowQueryResult["PRODUCT_NAME"];
						$productsDetails["QUANTITY_COST"] = $productsDetails["PRODUCT_QUANTITY"] * $rowQueryResult["PRODUCT_PRICE"];
						$productsArray[] = $productsDetails;
					}
					echo json_encode($productsArray);
				}
		} else {
			echo '<p class="error">Error! Could not prepare statement.</p>';
			exit();
			}
	} else {
		header("HTTP/1.1 406 Not Acceptable");
		exit();
	}