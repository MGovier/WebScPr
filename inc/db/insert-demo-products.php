<?php

function insert_demo_data($db) {
	$db->query(file_get_contents(ROOT_PATH . "inc/db/demo_categories.txt"));
	$db->query(file_get_contents(ROOT_PATH . "inc/db/demo_products.txt"));
}
