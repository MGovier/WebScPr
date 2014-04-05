<?php 
/*
	API for Individual Products
	Supports: 
		GET - Retrieve the details of the product with the specified ID as a JSON object. 
				If query=stock is provided, then only returns stock value as int.
		POST - Create a new product with provided product name, category, stock and price.
		PATCH - Update the stock and price of the item with the specified ID.
		DELETE - Remove the item of that specific ID.

	At the moment, this is hugely insecure as everyone has full API access.

	@author UP663652
*/

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
			// If the query specifies stock, then only return the matching stock number.
			if (isset($_GET["query"]) && $_GET["query"] == 'stock') {
				$stockQ = $db->stmt_init();
				if ($stockQ->prepare("SELECT PRODUCT_STOCK FROM PRODUCTS WHERE PRODUCT_ID=?")) {
					$stockQ->bind_param("i", $product_id);
					if ($result = retrieve_single_row($stockQ)) {
						echo intval($result["PRODUCT_STOCK"]);
					} else header("HTTP/1.1 204 No Content");
				} else header("HTTP/1.1 500 Internal Server Error");
			} else {
				// Otherwise send all fields.
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
			// Check all necessary fields are provided.
			if (empty($_POST["productName"]) 
				|| empty($_POST["productCategory"]) 
				|| empty($_POST["productStock"]) 
				|| empty($_POST["productPrice"])) {
				echo 'Error! All fields are required.';
				header ("HTTP/1.1 400 Bad Request");
				exit();
			}
			// Maybe a little paranoid about SQL injection...
			$productName = $db->real_escape_string($_POST["productName"]);
			$productCategory = $db->real_escape_string($_POST["productCategory"]);
			$productDescription = $db->real_escape_string($_POST["productDescription"]);
			$productStock = intval($db->real_escape_string($_POST["productStock"]));
			$productPrice = floatval($db->real_escape_string($_POST["productPrice"]));
			$catIDquery = $db->stmt_init();
			// Find the matching category ID. Sending the name instead of ID acts as a check against incorrect categories.
			if ($catIDquery->prepare("SELECT CATEGORY_ID FROM CATEGORIES WHERE CATEGORY_NAME LIKE ?")) {
				$catIDquery->bind_param("s", $productCategory);
				if ($result = retrieve_single_row($catIDquery)) {
					$categoryID = intval($result["CATEGORY_ID"]);
				} else {
					echo 'Error! Category not found.';
					header ("HTTP/1.1 400 Bad Request");
					exit();
				}
			} else {
				echo 'Error! Could not prepare statement.';
				header ("HTTP/1.1 500 Internal Server Error");
				exit();
			}
			// Find the current highest product ID + 1. 
			// We can't use MySQL's auto increment here, as we want to set the uploaded image URL to the new product ID.
			if ($currentmaxIDquery = $db->query("SELECT MAX(PRODUCT_ID) FROM PRODUCTS")) {
		            $row = $currentmaxIDquery->fetch_row();
		            $productID = intval($row[0]) + 1;
		    } else {
		            echo 'Database connection aborted.';
		            header ("HTTP/1.1 500 Internal Server Error");
		            exit();
		    }
		    // If they didn't provide an image, use a default... how about the favicon? Perfect.
		    if (null == ($_FILES["productImage"]["tmp_name"])) {
		    	$productImage = "img/assets/favicon.png";
		    } else {
		    	// If they did provide an image, check it is a suitable format and size, then rename it.
				$file = $_FILES['productImage'];
				$path = $file['name'];
				$fileExtension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
				$allowedExtensions = array("jpg", "jpeg", "png", "webp", "bmp", "gif", "svg");
				if (!(in_array($fileExtension, $allowedExtensions))) {
					echo ('Error: Unsupported File Type: ' . $fileExtension );
					header ("HTTP/1.1 400 Bad Request");
					exit();
				}
				if ($file['size'] > 8000000) {
					// Should optimise their file instead...
					echo 'Error: Files over 8Mb would be a little inefficient!.';
					header ("HTTP/1.1 400 Bad Request");
					exit();
				}
				$productImage = "img/products/" . $productID . '.' . $fileExtension;
				// Move their file to the product images location.
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
				header ("HTTP/1.1 500 Internal Server Error");
				exit();
			}
			break;

		case 'PATCH':
			// Get data from a PATCH request.
			parse_str(file_get_contents('php://input'), $requestData); 
			if (empty($requestData["id"])) {
				echo 'ID field is required.';
				header ("HTTP/1.1 400 Bad Request");
				exit();
			}
			$id = intval($requestData["id"]);
			// Woohoo, a sale!
			if (!(empty($requestData["sales"]))) {
				$salesQ = $db->stmt_init();
				if ($salesQ->prepare("SELECT PRODUCT_SALES FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
					$salesQ->bind_param("i", $id);
					if ($resultRow = retrieve_single_row($salesQ)) {
						$result = intval($resultRow["PRODUCT_SALES"]);
					} else {
						echo 'Product not found.';
						header ("HTTP/1.1 500 Internal Server Error");
						exit();
					}
				} else {
					echo 'Error! Could not prepare statement.';
					header ("HTTP/1.1 500 Internal Server Error");
					exit();
				}
				$totalSales = $result + $requestData["sales"];
				$query = $db->stmt_init();
				if ($query->prepare("UPDATE PRODUCTS SET PRODUCT_SALES = ? WHERE PRODUCT_ID = ?")) {
					$query->bind_param("ii", $totalSales, $id);
					$query->execute();
					echo 'Success! Items updated: ' . $query->affected_rows . '.';
					exit();
				} else {
					echo 'Error! Could not prepare statement.';
					header ("HTTP/1.1 500 Internal Server Error");
					exit();
				}
			}
			// If stockChange is provided they must want a stock change without specific values.
			else if (!(empty($requestData["stockChange"]))) {
				$currentStockQ = $db->stmt_init();
				if ($currentStockQ->prepare("SELECT PRODUCT_STOCK, PRODUCT_PRICE FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
					$currentStockQ->bind_param("i", $id);
					if ($resultRow = retrieve_single_row($currentStockQ)) {
						$result = intval($resultRow["PRODUCT_STOCK"]);
						$price = floatval($resultRow["PRODUCT_PRICE"]);
					} else {
						echo 'Product not found.';
						header ("HTTP/1.1 500 Internal Server Error");
						exit();
					}
					// Block requests which would put us in negative stock.	
					// First check if the stock is "taking away"
					if ($requestData["stockChange"] < 0) {
						// Now check if result minus the "taking away" puts us in negative
						if (($result + $requestData["stockChange"]) < 0) {
							// If it does, it should be blocked.
							echo "Invalid stock operation";
							header("HTTP/1.1 403 Forbidden");
							exit();
						}
					}
					$stockChange = intval($requestData["stockChange"]);
					$stock = $result + $stockChange;
				} else {
					echo 'Error! Could not prepare statement.';
					header ("HTTP/1.1 500 Internal Server Error");
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
				header ("HTTP/1.1 500 Internal Server Error");
				exit();
			}
			break;
			
		case 'DELETE':
			if (empty($_REQUEST["id"])) {
				echo 'Error! ID field is required.';
				header ("HTTP/1.1 400 Bad Request");
				exit();
			}
			$id = intval($_REQUEST["id"]);
			$picQ = $db->stmt_init();
			if ($picQ->prepare("SELECT PRODUCT_IMAGE FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
				$picQ->bind_param("i", $id);
				if ($result = retrieve_single_row($picQ)) {
						$pictureName = $result["PRODUCT_IMAGE"];
					} else {
						echo 'Error! Product not found.';
						header ("HTTP/1.1 500 Internal Server Error");
						exit();
					}
			} else {
				echo 'Error! Could not prepare statement.';
				header ("HTTP/1.1 500 Internal Server Error");
			}
			$query = $db->stmt_init();
			if ($query->prepare("DELETE FROM PRODUCTS WHERE PRODUCT_ID = ?")) {
				$query->bind_param("i", $id);
				$query->execute();
				echo 'Success! Items deleted: ' . $query->affected_rows . '.';
			} else {
				echo 'Error! Could not prepare statement.';
				header ("HTTP/1.1 500 Internal Server Error");
			}
			// Remove the associated image from the server (but make sure we're not removing the assets!)
			if (!(strpos($pictureName, "assets") || strpos($pictureName, "demo"))) {
				chdir(ROOT_PATH);
				unlink($pictureName);
			}
			break;

		default:
			header ("HTTP/1.1 405 Method Not Allowed");
			break;
	}
