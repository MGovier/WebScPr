<?php 
	require_once("../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	if (empty($_GET["adminToken"])) {
		echo '<p class="error">Error! No getting past my incredible security.</p>';
		exit();
	} elseif ($_GET["adminToken"] !== "845689458465189121856489418946548479") {
		echo '<p class="error">Error! No getting past my incredible security.</p>';
		exit();
	}
	if (empty($_GET["productID"])) {
		echo '<p class="error">Error! ID fields are required.</p>';
		exit();
	}
	$productID = intval($_GET["productID"]);
	$query = $db->stmt_init();
	if ($query->prepare("DELETE FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
		$query->bind_param("i", $productID);
		$query->execute();
		echo '<p class="success">Success! Items deleted: ' . $query->affected_rows . '.</p>';
	} else {
		echo '<p class="error">Error! Could not prepare statement.</p>';
	}