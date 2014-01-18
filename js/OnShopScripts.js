pageLoaded = function () {
	getAllProducts();
};

getAllProducts = function () {
	var target = document.getElementById("products");
	target.innerHTML = ('<img class="loader" src="img/ajax-loader.gif" alt="Loading">')
	var xhr = new XMLHttpRequest();
	changeListener = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var productsArray = eval(xhr.responseText);
			target.innerHTML = styleProducts(productsArray);
		} else {
			target.innerHTML = "<p>Something went wrong.</p>";
		}
	}
	xhr.open("GET", "API/GET/products.php", true);
	xhr.onreadystatechange = changeListener;
	xhr.send();
};

styleProducts = function (productsArray) {
	var formattedProducts = "";
	for (var i = productsArray.length - 1; i >= 0; i--) {
	 	var product = productsArray[i];
	 	formattedProducts += '<li><a href="' + product["PRODUCT_URL"] + '"' + 'onclick="return showProduct(' + product["PRODUCT_ID"] + ');"' 
	 					+ '><h4 class="productName">' 
	 					+ product["PRODUCT_NAME"] + '</h4>'
	 					+ '<img src="' + product["PRODUCT_IMAGE"]
	 					+ '" alt="' + product["PRODUCT_NAME"] + '"><p class="description">'
	 					+ product["PRODUCT_DESCRIPTION"].substring(0,110) + '...</p>'
	 					+ '<p class="cost">&pound;' + product["PRODUCT_PRICE"].toString() + '</a></p></li>';
	 	}
	return formattedProducts;
};

styleProduct = function (product) {
	var formattedProduct = "<h3>" + product["PRODUCT_NAME"] + "</h3>";
	return formattedProduct;
};

showProduct = function(productID) {
	var xhr = new XMLHttpRequest();
	var target = document.getElementById("products");
	changeListener = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var product = eval( "(" + xhr.responseText + ")");
			target.innerHTML = styleProduct(product);
			var featuretitle = document.getElementById("feature-title");
			featuretitle.innerHTML = product["PRODUCT_NAME"];
			var options = document.getElementById("sideoptions");
			options.innerHTML = ('<li><a href="#" onclick="getAllProducts();">Back</a></li>');
		} else {
			// waiting
		}
	}
	xhr.open("GET", "API/GET/product.php?id=" + productID, true);
	xhr.onreadystatechange = changeListener;
	xhr.send();
	return false;
};