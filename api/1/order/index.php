<?php 
/*
	API for Orders
	Supports: 
		POST - Create a new order, requires customer name, address, country, email and JSON order object.
		GET - Retrieve all orders of specified ID if given, or by default return all open orders as JSON.
		PATCH - Update the status of the order of the required ID.

	@author UP663652
*/

	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {

		case 'POST':
			// Check all necessary fields are provided.
			if (empty($_POST["customer-name"]) 
				|| empty($_POST["customer-address"]) 
				|| empty($_POST["customer-country"])
				|| empty($_POST["customer-email"]) 
				|| empty($_POST["customer-order"])) {
				echo 'Error! All fields are required.';
				header ("HTTP/1.1 400 Bad Request");
				exit();
			}
			$cAddress = $_POST["customer-address"] . ". \r\n" . $_POST["customer-country"];
			$query = $db->stmt_init();
			// Prepared statement to escape strings & prevent SQL injection.
			// Using NULL in the ID field so MySQL can use auto-incremented value.
			if ($query->prepare("INSERT INTO ORDERS VALUES (NULL, NOW(), ?, ?, ?, ?, 1)")) {
				$query->bind_param("ssss", $_POST["customer-name"], $cAddress, $_POST["customer-email"], $_POST["customer-order"]);
				$query->execute();
				echo "Order successful!";
			} else {
				header ("HTTP/1.1 400 Bad Request");
				echo 'Error! Could not prepare statement.';
				exit();
			}

		break;

		case 'GET':
			// If no ID specified, then output all open orders.
			if (!isset($_REQUEST["id"])) {
				$orders = $db->query("SELECT * FROM ORDERS WHERE ORDER_STATUS < 4");
				$orderOutput = array();
				while ($row = $orders->fetch_assoc()) {
			    	$orderOutput[] = $row;
				}
				echo json_encode($orderOutput);
			} else {
				// Otherwise return orders of matching ID.
				$id = intval($_REQUEST["id"]);
				$query = $db->stmt_init();
				$query->prepare("SELECT * FROM ORDERS WHERE ORDER_STATUS = ?");
				$query->bind_param("i", $id);
				$query->execute();
				$result = $query->get_result();
				$orderOutput = array();
				while ($row = $result->fetch_assoc()) {
			    	$orderOutput[] = $row;
				}
				echo json_encode($orderOutput);
			}
		break;

		case 'PATCH':
			if (empty($_REQUEST["id"])) {
				echo 'Error! ID field is required.';
				header("HTTP/1.1 400 Bad Request");
				exit();
			}
			$id = intval($_REQUEST["id"]);
			$query = $db->stmt_init();
			// Set the order status of the matching order ID to 4 (Finished).
			// Further order status codes could be added in the future.
			if ($query->prepare("UPDATE `ORDERS` SET `ORDER_STATUS` = '4' WHERE `ORDERS`.`ORDER_ID` = ?;")) {
				$query->bind_param("i", $id);
				$query->execute();
				echo 'Success! Orders updated: ' . $query->affected_rows . '.';
			} else {
				echo "Could not prepare statement.";
				header ("HTTP/1.1 500 Internal Server Error");
				exit();
			}
		break;

		default:
			header ("HTTP/1.1 405 Method Not Allowed");
			exit();
		break;
	}
