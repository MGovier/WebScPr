<?php 

function createDatabase($db) {
	// Set up Database
	if(!$db->query("CREATE DATABASE OnShop663652 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci")) {
		echo "Database could not be created.";
		return false;
	}
	$db->select_db(DB_NAME);
	if (!(createTables($db))) {
		echo "Error while creating the tables.";
		return false;
	}
	return true;
}

function createTables($db) {
	if (!($db->query("CREATE TABLE IF NOT EXISTS `PRODUCTS` (
						`PRODUCT_ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT ,
						`PRODUCT_NAME` VARCHAR( 40 ) NOT NULL ,
						`PRODUCT_DESCRIPTION` VARCHAR( 4000 ) DEFAULT NULL ,
						`PRODUCT_IMAGE` VARCHAR( 40 ) DEFAULT NULL ,
						`PRODUCT_PRICE` DECIMAL( 10, 2 ) NOT NULL ,
						`PRODUCT_STOCK` INT( 11 ) UNSIGNED NOT NULL ,
						`CATEGORY_ID` INT( 11 ) UNSIGNED NOT NULL ,
						PRIMARY KEY ( `PRODUCT_ID` )
						) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT = 1"))) {
		return false;
	}
	if (!($db->query("CREATE TABLE IF NOT EXISTS `CATEGORIES` (
						`CATEGORY_ID` INT( 11 ) UNSIGNED NOT NULL AUTO_INCREMENT ,
						`CATEGORY_NAME` VARCHAR( 60 ) NOT NULL ,
						PRIMARY KEY ( `CATEGORY_ID` )
						) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT = 1"))) {
		return false;
	}
	return true;
}
