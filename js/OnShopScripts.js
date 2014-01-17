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
	 	formattedProducts += '<li><a href="' + product["PRODUCT_URL"] + '"' + 'onclick="return getProduct(' + product["PRODUCT_ID"] + ');"' 
	 					+ '><h4 class="productName">' 
	 					+ product["PRODUCT_NAME"] + '</h4>'
	 					+ '<img src="' + product["PRODUCT_IMAGE"]
	 					+ '" alt="' + product["PRODUCT_NAME"] + '"><p class="description">'
	 					+ product["PRODUCT_DESCRIPTION"].substring(0,110) + '...</p>'
	 					+ '<p class="cost">&pound;' + product["PRODUCT_PRICE"].toString() + '</a></p></li>';
	 	}
	return formattedProducts;
};

getProduct = function(productID) {
	return false;
};

window.addEventListener("load", pageLoaded);