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
				header ("HTTP/1.1 400 Bad Request");
				exit();
			}
			$query = $db->stmt_init();
			if ($query->prepare("INSERT INTO ORDERS VALUES (NULL, NOW(), ?, ?, ?, ?, 1)")) {
				$query->bind_param("ssss", $_POST["customer-name"], $_POST["customer-address"], $_POST["customer-email"], $_POST["customer-order"]);
				$query->execute();
				echo "Order successful!";
			} else {
				header ("HTTP/1.1 400 Bad Request");
				echo 'Error! Could not prepare statement.';
				exit();
			}

		break;

		case 'GET':
			if (!isset($_REQUEST["id"])) {
				$orders = $db->query("SELECT * FROM ORDERS WHERE ORDER_STATUS < 4");
				$orderOutput = array();
				while ($row = $orders->fetch_assoc()) {
			    	$orderOutput[] = $row;
				}
				echo json_encode($orderOutput);
			}
		break;

		default:
			header ("HTTP/1.1 400 Bad Request");
			exit();
		break;
	}