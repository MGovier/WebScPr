<?php 

function createDatabase() {
	$database = new mysqli(DB_HOST,DB_USER,DB_PASS);
	// Set up Database
	if(!$database->query("CREATE DATABASE OnShop663652 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci")) {
		echo "Database could not be created.";
		return false;
	}
	$database->select_db(DB_NAME);
	if (!$database->query("CREATE TABLE IF NOT EXISTS `PRODUCTS` (
						`ID` INT( 11 ) NOT NULL AUTO_INCREMENT ,
						`NAME` VARCHAR( 40 ) NOT NULL ,
						`DESCRIPTION` VARCHAR( 400 ) DEFAULT NULL ,
						`IMAGE` VARCHAR( 40 ) DEFAULT NULL ,
						`PRICE` DECIMAL( 10, 2 ) NOT NULL ,
						PRIMARY KEY ( `ID` )
						) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT =1")) {
		echo "Error while creating the tables.";
		return false;
	}
	return true;
}
