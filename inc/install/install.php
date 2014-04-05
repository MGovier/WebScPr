<?php 

function createDatabase($db, $dbName) {
	// Set up Database
	if(!$db->query("CREATE DATABASE " . $dbName ." DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci")) {
		return false;
	}
	$db->select_db($dbName);
	if (!(createTables($db))) {
		return false;
	}
	return true;
}

function createTables($db) {
	if (!($db->query("CREATE TABLE IF NOT EXISTS `PRODUCTS` (
						`PRODUCT_ID` INT( 14 ) UNSIGNED NOT NULL AUTO_INCREMENT ,
						`PRODUCT_NAME` VARCHAR( 40 ) NOT NULL ,
						`PRODUCT_DESCRIPTION` VARCHAR( 4000 ) DEFAULT NULL ,
						`PRODUCT_IMAGE` VARCHAR( 40 ) DEFAULT NULL ,
						`PRODUCT_PRICE` DECIMAL( 10, 2 ) NOT NULL ,
						`PRODUCT_STOCK` INT( 11 ) UNSIGNED NOT NULL ,
						`PRODUCT_SALES` INT( 11 ) UNSIGNED DEFAULT 0,
						`CATEGORY_ID` INT( 11 ) UNSIGNED NOT NULL ,
						PRIMARY KEY ( `PRODUCT_ID` )
						) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT = 1"))) {
		return false;
	}
	if (!($db->query("CREATE TABLE IF NOT EXISTS `CATEGORIES` (
						`CATEGORY_ID` INT( 11 ) UNSIGNED NOT NULL AUTO_INCREMENT ,
						`CATEGORY_NAME` VARCHAR( 80 ) NOT NULL ,
						PRIMARY KEY ( `CATEGORY_ID` )
						) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT = 1"))) {
		return false;
	}
	if (!($db->query("CREATE TABLE IF NOT EXISTS `ORDERS` (
						`ORDER_ID` INT( 14 ) UNSIGNED NOT NULL AUTO_INCREMENT ,
						`ORDER_DATE` DATETIME NOT NULL ,
						`CUSTOMER_NAME` VARCHAR( 200 ) NOT NULL ,
						`CUSTOMER_ADDRESS` VARCHAR( 1500 ) NOT NULL ,
						`CUSTOMER_EMAIL` VARCHAR( 300 ) NOT NULL ,
						`ORDER_PRODUCTS` TEXT( 20000 ) NOT NULL ,
						`ORDER_STATUS` INT( 2 ) UNSIGNED NOT NULL ,
						PRIMARY KEY ( `ORDER_ID` )
						) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT = 1"))) {
		return false;
	}
	return true;
}

function insert_demo_data($db, $storeName) {
	$db->query("USE DATABASE OnShop" . $storeName);
	$db->query(file_get_contents("install/demo_categories.txt"));
	$db->query(file_get_contents("install/demo_products.txt"));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$dbAddress = $_POST["dbAddress"];
	$dbPort = $_POST["dbPort"];
	$dbUser = $_POST["dbUser"];
	$dbPass = $_POST["dbPass"];
	$storeName = $_POST["storeName"];
	$installAddress = $_POST["installAddress"];
	$dbDemo = $_POST["dbDemo"];
	$dbName = "OnShop_" . uniqid();
	chdir("..");

	if (strpos($installAddress, "index.php")) {
		$installAddress = substr($installAddress, 0, strlen($installAddress) - 9);
	}

	$db = new mysqli($dbAddress, $dbUser, $dbPass, null, $dbPort);

	if (!createDatabase($db, $dbName)) {
		$result = array('success' => False, 'message' => "Could not create database.");
		echo json_encode($result);
		exit();
	} else {
		if ($dbDemo == "true") {
			insert_demo_data($db, $dbName);
		}
	}
	$file = "config.php";
	$data = '<?php

    // static variables defined at installation.

	define("BASE_URL","' . $installAddress . '");
	define("ROOT_PATH",$_SERVER["DOCUMENT_ROOT"] . "' . $installAddress . '");

	define("DB_HOST","' . $dbAddress . '");
	define("DB_NAME","' . $dbName . '");
	define("DB_PORT","' . $dbPort . '"); // default for MySQL: 3306
	define("DB_USER","' . $dbUser . '");
	define("DB_PASS","' . $dbPass . '");

	// variables from settings.

	define("STORE_NAME","' . $storeName . '");
';
	file_put_contents($file, $data);
	$result = array('success' => True, 'message' => "Configuration file created.");
	echo json_encode($result);
}
