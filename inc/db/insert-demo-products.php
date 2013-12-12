<?php

function insert-demo-data($db) {
	$db->query(file_get_contents("inc/db/demo_products.txt"));
