// create a namespace for the JS, and ensure nothing is overwritten!
var OnShop = OnShop || {};

OnShop.functions = (function () {
    'use strict';
    var pageLoaded = function () {
        showDefaultHomepage();
    };

    var getAllProducts = function () {
        var target = document.getElementById('dynamic-content');
        target.classList.add('loading');
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status === 200 || this.status === 301) {
                var productsArray = JSON.parse(this.responseText);
                target.innerHTML = styleProducts(productsArray);
                target.classList.remove('loading');
            } else {
                target.innerHTML = '<p>Something went wrong.</p>';
            }
        };
        xhr.open('GET', 'API/GET/products.php', true);
        xhr.send();
    };

    var showDefaultHomepage = function () {
        var target = document.getElementById('sideoptions');
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status === 200 || this.status === 301) {
                var categories = JSON.parse(this.responseText);
                target.innerHTML = styleCategories(categories);
            }
        };
        xhr.open('GET', 'API/GET/categories.php', true);
        xhr.send();
        var title = document.getElementById('feature-title');
        title.innerHTML = 'Latest Products';
        getAllProducts();
    };

    var styleCategories = function (categoriesArray) {
        var formattedCategories = '';
        for (var i = categoriesArray.length - 1; i >= 0; i--) {
            var category = categoriesArray[i];
            formattedCategories += '<li>' + category.CATEGORY_NAME + '</li>';
        }
        return formattedCategories;
    };

    var styleProducts = function (productsArray) {
        var formattedProducts = '<ul id="products">';
        for (var i = productsArray.length - 1; i >= 0; i--) {
            var product = productsArray[i];
            formattedProducts += '<li><a href="' + product.PRODUCT_URL + '"' +
                            'onclick="return OnShop.functions.showProduct(' + product.PRODUCT_ID + ');"' +
                            '><h4 class="productName">' +
                            product.PRODUCT_NAME + '</h4>' +
                            '<img src="' + product.PRODUCT_IMAGE + '" alt="' +
                            product.PRODUCT_NAME + '"><p class="description">' +
                            product.PRODUCT_DESCRIPTION.substring(0,110) + '...</p>' +
                            '<p class="cost">&pound;' + Number(product.PRODUCT_PRICE).toFixed(2).toLocaleString() + '</a></p></li>';
            }
        return formattedProducts + '</ul>';
    };

    var styleProduct = function (product) {
        var formattedProduct = '<div id="product">' +
                               '<img src="' + product.PRODUCT_IMAGE + '" alt="' + product.PRODUCT_NAME + '">' +
                               '<div id="product-details">' +
                               '<p id="description">' + product.PRODUCT_DESCRIPTION + '</p>' +
                               '<p id="stock">Stock: ' + product.PRODUCT_STOCK + '</p>' +
                               '<p id="price">Price: ' + product.PRODUCT_PRICE + '</p>' +
                               '<button id="addToBasket">Add to Basket!</button></div>';
        return formattedProduct;
    };

    // WHY NO WORK?
    // var xhrGetter = function (source) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', source, true);
    //     xhr.onload = function () {
    //         if (this.status == 200 || this.status == 301) {
    //             return this.response;
    //         } else {
    //             return this.status;
    //         }
    //     };
    //     xhr.onerror = function () {return 'XHR Error'; };
    //     xhr.send();
    // };

    var showProduct = function(productID) {
        var xhr = new XMLHttpRequest();
        var target = document.getElementById('dynamic-content');
        xhr.onload = function () {
            if (this.status === 200 || this.status === 30) {
                var product = JSON.parse(xhr.responseText);
                target.innerHTML = styleProduct(product);
                var featuretitle = document.getElementById('feature-title');
                featuretitle.innerHTML = product.PRODUCT_NAME;
                var options = document.getElementById('sideoptions');
                document.title = product.PRODUCT_NAME;
                var stateObj = {'html': 'product.php?id=' + product.PRODUCT_ID};
                window.history.pushState(stateObj, product.PRODUCT_NAME, 'product.php?id=' + product.PRODUCT_ID);
                // window.onpopstate = showDefaultHomepage();
                options.innerHTML = ('<li><a href="#" onclick="OnShop.functions.showDefaultHomepage();">Back</a></li>');
                } else {
                target.innerHTML = this.status;
            }
        };
        xhr.open('GET', 'API/GET/product.php?id=' + productID, true);
        xhr.send();

        // var xhrresult = xhrGetter('API/GET/product.php?id=' + productID);
        // console.log(xhrresult);
        // var result = JSON.parse(xhrresult);
        // target.innerHTML = styleProduct(result);
        return false;
    };

    return {
        pageLoaded: pageLoaded,
        showProduct: showProduct,
        showDefaultHomepage: showDefaultHomepage
    };
}());
