<?php 
	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {
		case 'GET':
			# code...
			break;
		
		case 'POST':
			if (empty($_REQUEST["adminToken"])) {
				echo 'Error! No getting past my incredible security.';
				exit();
			} elseif ($_REQUEST["adminToken"] !== "845689458465189121856489418946548479") {
				echo 'Error! No getting past my incredible security.';
				exit();
			}
			if (empty($_REQUEST["categoryName"])) {
				echo 'Error! All fields are required.';
				exit();
			}	
			$categoryName = $db->real_escape_string($_REQUEST["categoryName"]);
			if (!($query = $db->stmt_init())) {
				echo 'Error! Could not initiate query.';
				exit();
			}
			if ($query->prepare("INSERT INTO CATEGORIES VALUES (NULL,?)")) {
				$query->bind_param("s", $categoryName);
				$query->execute();
				echo 'Category successfully inserted.';
			} else {
				echo 'Error! Database insertion problem.';
				exit();
			}
			break;

		default:
			header ("HTTP/1.1 400 Bad Request");
			break;
	}
	