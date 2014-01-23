// create a namespace for the JS, and ensure nothing is overwritten!
var OnShop = OnShop || {};

OnShop.functions = (function () {
    'use strict';
    var pageLoaded = function () {
        showDefaultHomepage();
    };

    var xhrClient = function (source, callback) {
    var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status == 200 || this.status == 304) {
                callback(this.response);
            } else {
                callback('Error with XHR');
            }
        };
    xhr.open('GET', source, true);
    xhr.onerror = function () {return 'XHR Error'; };
    xhr.send();
    };


    var showDefaultHomepage = function () {
        var catTarget = document.getElementById('sideoptions');
        var catCallback = function (responseText) {
            var categories = JSON.parse(responseText);
            catTarget.innerHTML = styleCategories(categories);
        };
        xhrClient('API/GET/categories.php', catCallback);
        var title = document.getElementById('feature-title');
        title.innerHTML = 'Latest Products';
        var target = document.getElementById('dynamic-content');
        target.classList.add('loading');
        var callback = function (responseText) {
            var productsArray = JSON.parse(responseText);
            showProducts(productsArray);
            target.classList.remove('loading');
            enableLiveSearch(target, productsArray);
            document.getElementById('sideoptions').addEventListener('click', function (e) {
                if (parseInt(e.target.id)) {
                    filterProducts(productsArray, e.target.id);
                }
                });
        };
        xhrClient('API/GET/products.php', callback);
    };

    var enableLiveSearch = function (target, productsArray) {
        var searchBox = document.getElementById('search');
            searchBox.addEventListener('keyup', function () {
                var string = searchBox.value.toLowerCase();
                var matches = [];
                for (var i = productsArray.length - 1; i >= 0; i--) {
                    var product = productsArray[i];
                    var productDescription = product.PRODUCT_DESCRIPTION.toLowerCase();
                    var productName = product.PRODUCT_NAME.toLowerCase();
                    if (productDescription.indexOf(string) >= 0 || productName.indexOf(string) >= 0) {
                        matches.push(product);
                    }
                }
                if (matches.length !== 0) {
                    showProducts(matches);
                } else {
                    target.innerHTML = '<p>No matches, sorry!</p>';
                }
            });
    };

    var filterProducts = function (productsArray, categoryID) {
            var matches = [];
            for (var i = productsArray.length - 1; i >= 0; i--) {
                var product = productsArray[i];
                if (product.CATEGORY_ID == categoryID) {
                    matches.push(product);
                }
            }
            showProducts(matches);
    };

    var styleCategories = function (categoriesArray) {
        var formattedCategories = '';
        for (var i = categoriesArray.length - 1; i >= 0; i--) {
            var category = categoriesArray[i];
            formattedCategories += '<li class="category" id="' + category.CATEGORY_ID + '">'+ category.CATEGORY_NAME + '</li>';
        }
        return formattedCategories;
    };

    var showProducts = function (productsArray) {
        var target = document.getElementById('dynamic-content');
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
        target.innerHTML = formattedProducts;
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

    var showProduct = function(productID) {
        var target = document.getElementById('dynamic-content');
        var callback = function (responseText) {
            var product = JSON.parse(responseText);
            target.innerHTML = styleProduct(product);
            var featuretitle = document.getElementById('feature-title');
            featuretitle.innerHTML = product.PRODUCT_NAME;
            var options = document.getElementById('sideoptions');
            document.title = product.PRODUCT_NAME;
            var stateObj = {'html': 'product.php?id=' + product.PRODUCT_ID};
            window.history.pushState(stateObj, product.PRODUCT_NAME, 'product.php?id=' + product.PRODUCT_ID);
            // window.onpopstate = showDefaultHomepage();
            options.innerHTML = ('<li><a href="#" onclick="OnShop.functions.showDefaultHomepage();">Back</a></li>');
        };
        xhrClient('API/GET/product.php?id=' + productID, callback);
        return false;
    };

    return {
        pageLoaded: pageLoaded,
        showProduct: showProduct,
        showDefaultHomepage: showDefaultHomepage
    };
}());
