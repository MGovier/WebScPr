<?php
	require_once($_SERVER["DOCUMENT_ROOT"] . "/663652/OnShop/inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$categories = $db->query("SELECT * FROM CATEGORIES");
	$categoriesArray = array();
	while ($row = $categories->fetch_assoc()) {
	    $categoriesArray[] = $row;
	}
	echo json_encode($categoriesArray);
?>
