<?php 
	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {
		case 'POST':
			if (empty($_POST["customer-name"]) 
				|| empty($_POST["customer-address"]) 
				|| empty($_POST["customer-country"])
				|| empty($_POST["customer-email"]) 
				|| empty($_POST["customer-order"])) {
				echo 'Error! All fields are required.';
				exit();
			}
			$query = $db->stmt_init();
			if ($query->prepare("INSERT INTO ORDERS VALUES (NULL, NOW(), ?, ?, ?, ?, 1)")) {
				$query->bind_param("sss", $_POST["customer-name"], $_POST["customer-address"], , $_POST["customer-email"], $_POST["customer-order"]);
				$query->execute();
				echo "Order successful!";
			} else {
				echo 'Error! Could not prepare statement.';
				exit();
			}

		break;

		case 'GET':

		break;
	}