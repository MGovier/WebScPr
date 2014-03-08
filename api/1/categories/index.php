<?php
	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {
		
		case 'GET':
			if (isset($_GET["empty"]) && $_GET["empty"] === "false") {
				$categories = $db->query("SELECT * FROM CATEGORIES AS C, PRODUCTS AS P WHERE C.CATEGORY_ID = P.CATEGORY_ID GROUP BY C.CATEGORY_ID");
			} elseif (isset($_GET["count"]) && $_GET["count"] === "products") {
				$categories = $db->query("SELECT C.CATEGORY_ID, C.CATEGORY_NAME, COUNT(P.PRODUCT_ID) AS COUNT FROM CATEGORIES C LEFT JOIN PRODUCTS P ON C.CATEGORY_ID = P.CATEGORY_ID GROUP BY C.CATEGORY_ID");
			}
			else {
				$categories = $db->query("SELECT * FROM CATEGORIES");
			}
			$categoriesArray = array();
			while ($row = $categories->fetch_assoc()) {
			    $categoriesArray[] = $row;
			}
			echo json_encode($categoriesArray);
			break;
			
		default:
			header ("HTTP/1.1 400 Bad Request");
			break;
	}
