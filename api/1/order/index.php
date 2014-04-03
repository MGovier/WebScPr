<?php 
	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {
		case 'POST':
			if (empty($_POST["customer-name"]) 
				|| empty($_POST["customer-address"]) 
				|| empty($_POST["customer-country"]) 
				|| empty($_POST["customer-order"])) {
				echo 'Error! All fields are required.';
				exit();
			}
			$cName = $db->real_escape_string($_POST["customer-name"]);
			$cAddress = $db->real_escape_string($_POST["customer-address"]);
			$cOrder = $db->real_escape_string($_POST["customer-order"]);
			$query = $db->stmt_init();
			if ($query->prepare("INSERT INTO ORDERS VALUES (NULL, NOW(), ?, ?, ?, 1)")) {
				$query->bind_param("sss", $cName, $cAddress, $cOrder);
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