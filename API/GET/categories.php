<?php
	require_once("../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	if (isset($_GET["empty"]) && $_GET["empty"] === "false") {
		$categories = $db->query("SELECT * FROM CATEGORIES AS C, PRODUCTS AS P WHERE C.CATEGORY_ID = P.CATEGORY_ID GROUP BY C.CATEGORY_ID");
	} else {
		$categories = $db->query("SELECT * FROM CATEGORIES");
	}
	$categoriesArray = array();
	while ($row = $categories->fetch_assoc()) {
	    $categoriesArray[] = $row;
	}
	echo json_encode($categoriesArray);
?>
