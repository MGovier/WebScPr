// create a namespace for the JS, and ensure nothing is overwritten!
var OnShop = OnShop || {};

OnShop.functions = (function () {
    'use strict';
    var pageLoaded = function () {
        getAllProducts();
    };

    var getAllProducts = function () {
        var target = document.getElementById('products');
        target.innerHTML = ('<img class="loader" src="img/ajax-loader.gif" alt="Loading">');
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status === 200) {
                var productsArray = JSON.parse(xhr.responseText);
                target.innerHTML = styleProducts(productsArray);
            } else {
                target.innerHTML = '<p>Something went wrong.</p>';
            }
        };
        xhr.open('GET', 'API/GET/products.php', true);
        xhr.send();
    };

    var styleProducts = function (productsArray) {
        var formattedProducts = '';
        for (var i = productsArray.length - 1; i >= 0; i--) {
            var product = productsArray[i];
            formattedProducts += '<li><a href="' + product.PRODUCT_URL + '"' +
                            'onclick="return OnShop.functions.showProduct(' + product.PRODUCT_ID + ');"' +
                            '><h4 class="productName">' +
                            product.PRODUCT_NAME + '</h4>' +
                            '<img src="' + product.PRODUCT_IMAGE + '" alt="' +
                            product.PRODUCT_NAME + '"><p class="description">' +
                            product.PRODUCT_DESCRIPTION.substring(0,110) + '...</p>' +
                            '<p class="cost">&pound;' + product.PRODUCT_PRICE.toString() + '</a></p></li>';
            }
        return formattedProducts;
    };

    var styleProduct = function (product) {
        var formattedProduct = '<h3>' + product.PRODUCT_NAME + '</h3>';
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
        var target = document.getElementById('products');
        xhr.onload = function () {
            if (this.status === 200) {
                var product = JSON.parse(xhr.responseText);
                target.innerHTML = styleProduct(product);
                var featuretitle = document.getElementById('feature-title');
                featuretitle.innerHTML = product.PRODUCT_NAME;
                var options = document.getElementById('sideoptions');
                options.innerHTML = ('<li><a href="#" onclick="OnShop.functions.getAllProducts();">Back</a></li>');
            } else {
                // waiting
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
        getAllProducts: getAllProducts
    };
}());

window.addEventListener('load', OnShop.functions.pageLoaded);