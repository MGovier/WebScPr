			var xhr, target, changeListener;
			pageLoaded = function () {
			target = document.getElementById("products");
			xhr = new XMLHttpRequest();
			styleProducts = function (productsArray) {
				var formattedProducts;
				for (var i = productsArray.length - 1; i >= 0; i--) {
				 	var product = productsArray[i];
				 	formattedProducts += '<li><a href="#"><h4 class="productName">' 
				 					+ product["PRODUCT_NAME"] + '</h4>'
				 					+ '<img src="<?php echo BASE_URL; ?>' + product["PRODUCT_IMAGE"]
				 					+ '" alt="' + product["PRODUCT_NAME"] + '"><p class="description">'
				 					+ product["PRODUCT_DESCRIPTION"] + '</p></li>';
				 };
				return formattedProducts;
			}
			changeListener = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					var productsArray = eval(xhr.responseText);
					target.innerHTML = styleProducts(productsArray);
				} else {
					target.innerHTML = "<p>Something went wrong.</p>";
				}
			};
			xhr.open("GET", "<?php echo BASE_URL; ?>API/GET/products.php", true);
			xhr.onreadystatechange = changeListener;
			xhr.send();
			};
			window.addEventListener("load", pageLoaded);