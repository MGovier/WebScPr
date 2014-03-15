<?php

    // static variables defined at installation.

	define("BASE_URL","/663652/");
	define("ROOT_PATH",$_SERVER["DOCUMENT_ROOT"] . "/663652/");

	define("DB_HOST","localhost");
	define("DB_NAME","OnShop663652");
	define("DB_PORT","3306"); // default for MySQL: 3306
	define("DB_USER","root");
	define("DB_PASS","");

	// variables from settings.

	define("STORE_NAME","OnShop");


// something like this?
// class MyConfig
// {
//     public static function read($filename)
//     {
//         $config = include $filename;
//         return $config;
//     }
//     public static function write($filename, array $config)
//     {
//         $config = var_export($config, true);
//         file_put_contents($filename, "<?php return $config ;");
//     }
// }

// http://stackoverflow.com/questions/2237291/reading-and-writing-configuration-files