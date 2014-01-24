<?php 
	require_once("../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	if (isset($_GET["id"])) {
		$product_id = intval($_GET["id"]);
	} else {
		exit();
	}
	$id = $db->real_escape_string($product_id);
	$query = $db->stmt_init();
	if ($query->prepare("SELECT * FROM PRODUCTS WHERE PRODUCT_ID=?")) {
		$query->bind_param("s", $id);
		$query->execute();
		$result = $query->get_result();
		if (mysqli_num_rows($result) === 1) {
			$product = $result->fetch_assoc();
			$product["PRODUCT_IMAGE"] = BASE_URL . $product["PRODUCT_IMAGE"];
			$product["PRODUCT_URL"] = BASE_URL . "product.php?id=" . $product["PRODUCT_ID"];
			echo json_encode($product);
		} else echo "Couldn't prepare query!";
	} else echo "Error!";

?>
