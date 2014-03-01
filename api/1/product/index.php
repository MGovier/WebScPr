<?php 
	require_once("../../../inc/config.php");
	include(ROOT_PATH . "inc/db/database.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {

		case 'GET':
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
				} else header("HTTP/1.1 204 No Content");
			} else header("HTTP/1.1 500 Internal Server Error");
			break;

		case 'POST':
			if (empty($_POST["productName"]) 
				|| empty($_POST["productCategory"]) 
				|| empty($_POST["productDescription"]) 
				|| empty($_POST["productStock"]) 
				|| empty($_POST["productPrice"])) {
				echo 'Error! All fields are required.';
				exit();
			}
			if (empty($_POST["adminToken"])) {
				echo 'Error! No getting past my incredible security.';
				exit();
			} elseif ($_POST["adminToken"] !== "845689458465189121856489418946548479") {
				echo 'Error! No getting past my incredible security.';
				exit();
			}

			$productName = $db->real_escape_string($_POST["productName"]);
			$productCategory = $db->real_escape_string($_POST["productCategory"]);
			$productDescription = $db->real_escape_string($_POST["productDescription"]);
			$productStock = intval($db->real_escape_string($_POST["productStock"]));
			$productPrice = floatval($db->real_escape_string($_POST["productPrice"]));
			$categoryIDquery = $db->stmt_init();
			if ($categoryIDquery->prepare("SELECT CATEGORY_ID FROM CATEGORIES WHERE CATEGORY_NAME LIKE ?")) {
				$categoryIDquery->bind_param("s", $productCategory);
				$categoryIDquery->execute();
				$categoryIDresult = $categoryIDquery->get_result();
				if (mysqli_num_rows($categoryIDresult) === 1) {
					$categoryIDresultRow = $categoryIDresult->fetch_row();
					$categoryID = intval($categoryIDresultRow[0]);
				} else {
					echo 'Error! Category not found.';
					exit();
				}
			} else {
				echo 'Error! Could not prepare statement.';
				exit();
			}
			if ($currentmaxIDquery = $db->query("SELECT MAX(PRODUCT_ID) FROM PRODUCTS")) {
		            $row = $currentmaxIDquery->fetch_row();
		            $productID = intval($row[0]) + 1;
		    } else {
		            echo 'Error! Problem with the database.';
		            exit();
		    }
		    if (null == ($_FILES["productImage"]["tmp_name"])) {
		    	$productImage = "img/assets/favicon.png";
		    } else {
				$file = $_FILES['productImage'];
				$path = $file['name'];
				echo $path;
				$fileExtension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
				$allowedExtensions = array("jpg", "jpeg", "png", "webp", "bmp", "gif", "svg");
				if (!(in_array($fileExtension, $allowedExtensions))) {
					echo ('Error! Unsupported File Type: ' . $fileExtension );
					exit();
				}
				if ($file['size'] > 12000000) {
					echo 'Error! Files over 12MB are not supported.';
					exit();
				}
				$productImage = "img/products/" . $productID . '.' . $fileExtension;
				move_uploaded_file($file["tmp_name"], ROOT_PATH . $productImage);
			}
			if ($query = $db->prepare("INSERT INTO `PRODUCTS` VALUES (?,?,?,?,?,?,?)")) {
				// `PRODUCT_ID`, `PRODUCT_NAME`, `PRODUCT_DESCRIPTION`, `PRODUCT_IMAGE`, `PRODUCT_PRICE`, `PRODUCT_STOCK`, `CATEGORY_ID`
				// int, string, string, string, double, int, int. Phew!
				$query->bind_param("isssdii", $productID, $productName, $productDescription, $productImage, $productPrice, $productStock, $categoryID);
				$query->execute();
				echo 'Product successfully inserted.';
			} else {
				echo 'Error! Database insertion problem.';
				exit();
			}
			break;

		case 'PATCH':
			// to get data from a PATCH request.
			parse_str(file_get_contents('php://input'), $requestData); 
			if (empty($requestData["id"])) {
				echo 'Error! ID field is required.';
				exit();
			}
			$id = intval($requestData["id"]);
			if (!(empty($requestData["stockChange"]))) {
				$currentStockQ = $db->stmt_init();
				if ($currentStockQ->prepare("SELECT PRODUCT_STOCK FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
					$currentStockQ->bind_param("i", $id);
					$currentStockQ->execute();
					$resultQ = $currentStockQ->get_result();
					if (mysqli_num_rows($resultQ) === 1) {
						$resultQRow = $resultQ->fetch_row();
						$result = intval($resultQRow[0]);
					} else {
						echo 'Error! Product not found.';
						exit();
					}	
					if ($requestData["stockChange"] < 0) {
						if (($result + $requestData["stockChange"]) < 0) {
							header("HTTP/1.1 403 Forbidden");
							exit();
						}
					}
					$stockChange = intval($requestData["stockChange"]);
					$stock = $result + $stockChange;
				} else {
					echo 'Error! Could not prepare statement.';
				}
			} else {
				$stock = intval($requestData["stock"]);
			}
			$query = $db->stmt_init();
			if ($query->prepare("UPDATE PRODUCTS SET PRODUCT_STOCK = ? WHERE PRODUCT_ID = ?")) {
				$query->bind_param("ii", $stock, $id);
				$query->execute();
				echo 'Success! Items updated: ' . $query->affected_rows . '.';
			} else {
				echo 'Error! Could not prepare statement.';
			}
			break;
			
		case 'DELETE':
			if (empty($_REQUEST["id"])) {
				echo '<p class="error">Error! ID field is required.</p>';
				exit();
			}
			$id = intval($_REQUEST["id"]);
			$query = $db->stmt_init();
			if ($query->prepare("DELETE FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
				$query->bind_param("i", $id);
				$query->execute();
				echo 'Success! Items deleted: ' . $query->affected_rows . '.';
			} else {
				echo 'Error! Could not prepare statement.';
			}
			break;

		default:
			header ("HTTP/1.1 400 Bad Request");
			break;
	}
	
