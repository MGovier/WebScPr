<?php 
	require_once("../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	if (empty($_POST["adminToken"])) {
		echo '<p class="error">Error! No getting past my incredible security.</p>';
		exit();
	} elseif ($_POST["adminToken"] !== "845689458465189121856489418946548479") {
		echo '<p class="error">Error! No getting past my incredible security.</p>';
		exit();
	}
	if (empty($_POST["categoryName"])) {
		echo '<p class="error">Error! All fields are required.</p>';
		exit();
	}	
	$categoryName = $db->real_escape_string($_POST["categoryName"]);
	if (!($query = $db->stmt_init())) {
		echo '<p class="error">Error! Could not initiate query.</p>';
		exit();
	}
	if ($query->prepare("INSERT INTO CATEGORIES VALUES (NULL,?)")) {
		$query->bind_param("s", $categoryName);
		$query->execute();
		echo '<p class="success">Category successfully inserted.</p>';
	} else {
		echo '<p class="error">Error! Database insertion problem.</p>';
		exit();
	}	
