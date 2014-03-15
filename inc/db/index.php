<?php
	// @ to suppress warnings, as any errors are output anyway!
	function testDbConnection ($address, $port, $user, $pass) {
		$db = @new mysqli($address, $user, $pass, null, $port);
		if ($db->connect_error) {
			$result = array(
				"success" => False,
				"message" => "Could not connect to database: " . $db->connect_error,
				);
		} else {
			$result = array(
				"success" => True,
				"message" => @$db->host_info . "\n",
				);
		}
		return $result;
	}

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$dbAddress = $_POST["dbAddress"];
		$dbPort = $_POST["dbPort"];
		$dbUser = $_POST["dbUser"];
		$dbPass = $_POST["dbPass"];
		$result = testDbConnection($dbAddress, $dbPort, $dbUser, $dbPass);
		echo json_encode($result);
	} else {
		header ("HTTP/1.1 400 Bad Request");
	}
	