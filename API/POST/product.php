<?php 
	require_once($_SERVER["DOCUMENT_ROOT"] . "/663652/OnShop/inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$productName = $db->real_escape_string($_POST["productName"]);
	$productCategory = $db->real_escape_string($_POST["productCategory"]);
	$productDescription = $db->real_escape_string($_POST["productDescription"]);
	$productStock = intval($db->real_escape_string($_POST["productStock"]));
	$productPrice = floatval($db->real_escape_string($_POST["productPrice"]));

	if (strlen($productName) == 0 || strlen($productCategory) == 0 || strlen($productDescription) == 0 || strlen($productStock) == 0 || strlen($productPrice) == 0) {
		echo '<p class="error">Error! All fields are required.</p>';
		exit();
	}
	if ($currentmaxIDquery = $db->query("SELECT MAX(PRODUCT_ID) FROM PRODUCTS")) {
		$row = $currentmaxIDquery->fetch_row();
		$productID = intval($row[0]) + 1;
	} else  {
		echo '<p class="error">Error! Problem with the database.</p>';
		exit();
	}
	if ($categoryIDquery = $db->prepare("SELECT CATEGORY_ID FROM CATEGORIES WHERE CATEGORY_NAME LIKE ?")) {
		$categoryIDquery->bind_param("s", $productCategory);
		$categoryIDquery->execute();
		$categoryIDresult = $categoryIDquery->get_result();
		if (mysqli_num_rows($categoryIDresult) === 1) {
			$categoryIDresultRow = $categoryIDresult->fetch_row();
			$categoryID = intval($categoryIDresultRow[0]);
		} else {
			echo '<p class="error">Error! Category not found.</p>';
			exit();
		}
	}
	$file = $_FILES['productImage'];
	$path = $file['name'];
	$fileExtension = pathinfo($path, PATHINFO_EXTENSION);
	$allowedExtensions = array("jpg", "jpeg", "png", "webp", "bmp", "gif", "svg");
	if (!(in_array($fileExtension, $allowedExtensions))) {
		echo '<p class="error">Error! Unsupported File Type.</p>';
		exit();
	}
	if ($file['size'] > 10000000) {
		echo '<p class="error">Error! File over 10mb.</p>';
		exit();
	}
	$productImage = "img/products/" . $productID . '.' . $fileExtension;
	move_uploaded_file($file["tmp_name"], ROOT_PATH . $productImage);
	if ($query = $db->prepare("INSERT INTO `PRODUCTS` VALUES (?,?,?,?,?,?,?)")) {
		// `PRODUCT_ID`, `PRODUCT_NAME`, `PRODUCT_DESCRIPTION`, `PRODUCT_IMAGE`, `PRODUCT_PRICE`, `PRODUCT_STOCK`, `CATEGORY_ID`
		// int, string, string, string, double, int, int. Phew!
		$query->bind_param("isssdii", $productID, $productName, $productDescription, $productImage, $productPrice, $productStock, $categoryID);
		$query->execute();
		echo '<p class="success">Product successfully inserted.</p>';
	} else {
		echo '<p class="error">Error! Database insertion problem.</p>';
		exit();
	}



?>