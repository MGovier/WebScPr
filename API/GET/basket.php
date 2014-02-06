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
						$rowQuery = $db->query("SELECT PRODUCT_PRICE FROM PRODUCTS WHERE PRODUCT_ID =" . $row["PRODUCT_ID"]);
						$rowQueryResult = $rowQuery->fetch_row();
						$productsDetails["PRODUCT_PRICE"] = floatval($rowQueryResult[0]);
						$productsArray[] = $productsDetails;
					}
					echo json_encode($productsArray);
				}
		} else {
			echo '<p class="error">Error! Could not prepare statement.</p>';
			exit();
			}
	} else {
		echo uniqid() . md5(mt_rand());
    	}