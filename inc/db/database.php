<?php
	$db = new mysqli(DB_HOST,DB_USER,DB_PASS);
	if (!($db->select_db(DB_NAME))) {
	    include(ROOT_PATH . "inc/db/install-db.php");
	    echo createDatabase($db);
	    $db->select_db(DB_NAME);
	}