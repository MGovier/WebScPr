<?php 
	require_once("../../../inc/config.php");
	require(ROOT_PATH . "inc/db/database.php");
	require(ROOT_PATH . "inc/lib/lib.php");
	$request = $_SERVER["REQUEST_METHOD"];
	switch ($request) {

		case 'GET':
			if (isset($_GET["id"])) {
				$product_id = intval($_GET["id"]);
			} else {
				header ("HTTP/1.1 400 Bad Request");
				exit();
			}
			if (isset($_GET["query"]) && $_GET["query"] == 'stock') {
				$stockQ = $db->stmt_init();
				if ($stockQ->prepare("SELECT PRODUCT_STOCK FROM PRODUCTS WHERE PRODUCT_ID=?")) {
					$stockQ->bind_param("i", $product_id);
					if ($result = retrieve_single_row($stockQ)) {
						echo intval($result["PRODUCT_STOCK"]);
					} else header("HTTP/1.1 204 No Content");
				} else header("HTTP/1.1 500 Internal Server Error");
			} else {
				$query = $db->stmt_init();
				if ($query->prepare("SELECT * FROM PRODUCTS WHERE PRODUCT_ID=?")) {
					$query->bind_param("i", $product_id);
					if ($product = retrieve_single_row($query)) {
						$product["PRODUCT_IMAGE"] = BASE_URL . $product["PRODUCT_IMAGE"];
						$product["PRODUCT_URL"] = BASE_URL . "product.php?id=" . $product["PRODUCT_ID"];
						echo json_encode($product);
					} else header("HTTP/1.1 204 No Content");
				} else header("HTTP/1.1 500 Internal Server Error");
			}
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
			// Maybe a little paranoid about SQL injection...
			$productName = $db->real_escape_string($_POST["productName"]);
			$productCategory = $db->real_escape_string($_POST["productCategory"]);
			$productDescription = $db->real_escape_string($_POST["productDescription"]);
			$productStock = intval($db->real_escape_string($_POST["productStock"]));
			$productPrice = floatval($db->real_escape_string($_POST["productPrice"]));
			$catIDquery = $db->stmt_init();
			if ($catIDquery->prepare("SELECT CATEGORY_ID FROM CATEGORIES WHERE CATEGORY_NAME LIKE ?")) {
				$catIDquery->bind_param("s", $productCategory);
				if ($result = retrieve_single_row($catIDquery)) {
					$categoryID = intval($result["CATEGORY_ID"]);
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
					echo ('Error: Unsupported File Type: ' . $fileExtension );
					exit();
				}
				if ($file['size'] > 8000000) {
					echo 'Error: Files over 8MB would be a little inefficient!.';
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
			// Get data from a PATCH request.
			parse_str(file_get_contents('php://input'), $requestData); 
			if (empty($requestData["id"])) {
				echo 'Error! ID field is required.';
				exit();
			}
			$id = intval($requestData["id"]);
			// They want to do a stock change without specific values.
			if (!(empty($requestData["stockChange"]))) {
				$currentStockQ = $db->stmt_init();
				if ($currentStockQ->prepare("SELECT PRODUCT_STOCK, PRODUCT_PRICE FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
					$currentStockQ->bind_param("i", $id);
					if ($resultRow = retrieve_single_row($currentStockQ)) {
						$result = intval($resultRow["PRODUCT_STOCK"]);
						$price = floatval($resultRow["PRODUCT_PRICE"]);
					} else {
						echo 'Error! Product not found.';
						exit();
					}
					// Block requests which would put us in negative stock.	
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
			// Otherwise they must be setting stock and price in an update!
			} else {
				$stock = intval($requestData["stock"]);
				$price = floatval($requestData["price"]);
			}
			$query = $db->stmt_init();
			if ($query->prepare("UPDATE PRODUCTS SET PRODUCT_STOCK = ?, PRODUCT_PRICE = ? WHERE PRODUCT_ID = ?")) {
				$query->bind_param("idi", $stock, $price, $id);
				$query->execute();
				echo 'Success! Items updated: ' . $query->affected_rows . '.';
			} else {
				echo 'Error! Could not prepare statement.';
			}
			break;
			
		case 'DELETE':
			if (empty($_REQUEST["id"])) {
				echo 'Error! ID field is required.';
				exit();
			}
			$id = intval($_REQUEST["id"]);
			$picQ = $db->stmt_init();
			if ($picQ->prepare("SELECT PRODUCT_IMAGE FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
				$picQ->bind_param("i", $id);
				$picQ->execute();
				if ($result = retrieve_single_row($picQ)) {
						$pictureName = $result["PRODUCT_IMAGE"];
					} else {
						echo 'Error! Product not found.';
						exit();
					}
			} else {
				echo 'Error! Could not prepare statement.';
			}
			$query = $db->stmt_init();
			if ($query->prepare("DELETE FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
				$query->bind_param("i", $id);
				$query->execute();
				echo 'Success! Items deleted: ' . $query->affected_rows . '.';
			} else {
				echo 'Error! Could not prepare statement.';
			}
			chdir(ROOT_PATH);
			unlink($pictureName);
			break;

		default:
			header ("HTTP/1.1 400 Bad Request");
			break;
	}
