<?php
/*
	API for All Categories
	Supports: 
		GET - Retrieve all categories by default, as a JSON object. 
				Can provide a count of products in each category with count=products 
				OR nonempty categories by setting empty=false.

	@author UP663652
*/

	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {
		
		case 'GET':
			// Check if they want non-empty, or counts of products.
			if (isset($_GET["empty"]) && $_GET["empty"] === "false") {
				$categories = $db->query("SELECT * FROM CATEGORIES AS C, PRODUCTS AS P WHERE C.CATEGORY_ID = P.CATEGORY_ID GROUP BY C.CATEGORY_ID");
			} elseif (isset($_GET["count"]) && $_GET["count"] === "products") {
				$categories = $db->query("SELECT C.CATEGORY_ID, C.CATEGORY_NAME, COUNT(P.PRODUCT_ID) AS COUNT FROM CATEGORIES C LEFT JOIN PRODUCTS P ON C.CATEGORY_ID = P.CATEGORY_ID GROUP BY C.CATEGORY_ID");
			}
			// If not specified, return all category details.
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
			header ("HTTP/1.1 405 Method Not Allowed");
			break;
	}
