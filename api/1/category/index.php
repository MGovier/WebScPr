<?php 
	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {
		case 'DELETE':
			if (isset($_REQUEST["id"])) {
				$id = intval($_REQUEST["id"]);
				$query = $db->stmt_init();
				if ($query->prepare("DELETE FROM `categories` WHERE `CATEGORY_ID` = ?")) {
					$query->bind_param("i", $id);
					$query->execute();
					echo 'Success, categories deleted: ' . $query->affected_rows;
				} else {
					echo 'Error! Could not prepare query.';
					header ("HTTP/1.1 500 Internal Server Error");
					exit();
				}
			} else header ("HTTP/1.1 400 Bad Request");
			break;
		
		case 'POST':
			if (empty($_REQUEST["categoryName"])) {
				echo 'Error! All fields are required.';
				header ("HTTP/1.1 400 Bad Request");
				exit();
			}	
			$categoryName = $db->real_escape_string($_REQUEST["categoryName"]);
			if (!($query = $db->stmt_init())) {
				echo 'Error! Could not initiate query.';
				header ("HTTP/1.1 500 Internal Server Error");
				exit();
			}
			if ($query->prepare("INSERT INTO CATEGORIES VALUES (NULL,?)")) {
				$query->bind_param("s", $categoryName);
				$query->execute();
				echo 'Category successfully inserted.';
			} else {
				echo 'Error! Database insertion problem.';
				header ("HTTP/1.1 500 Internal Server Error");
				exit();
			}
			break;

		default:
			header ("HTTP/1.1 405 Method Not Allowed");
			break;
	}
