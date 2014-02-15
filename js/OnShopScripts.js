// create a namespace for the JS, and ensure nothing is overwritten.
var OnShop = OnShop || {};

OnShop.functions = function () {
    'use strict';

    var s = {
        settings: {
            dynamicArea: 'dynamic-content',
            shopName: document.title,
            sideMenu: 'options',
            featureTitle: 'feature-title',
            basket: 'basket'
        },

        init: function() {
            this.settings.dynamicArea = document.getElementById(this.settings.dynamicArea);
            this.settings.sideMenu = document.getElementById(this.settings.sideMenu);
            this.settings.featureTitle = document.getElementById(this.settings.featureTitle);
            this.settings.basket = document.getElementById(this.settings.basket);
            s = this.settings;
        }

    };

    function pageLoaded () {
        s.init();
        checkURL();
    }

    function checkURL() {
        if (document.URL.indexOf('admin') > -1) {
            // do nothing.
        } else {
            var gets = window.location.search;
            if ((gets.indexOf('?id') > -1)) {
                var id = gets.split('=');
                showProduct(id[id.length-1]);
            } else {showProducts();}
        }
    }

    function xhrClient (source, callback, args) {
    var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status == '200' || this.status == '304') {
                callback(this.response, args);
            } else {
                callback(this.status);
            }
        };
    xhr.open('GET', source, true);
    xhr.onerror = function () {return 'XHR Error'; };
    xhr.send();
    }


    function loadCategories() {
        var catCallback = function (responseText) {
            var categories = JSON.parse(responseText);
            s.sideMenu.innerHTML = styleCategories(categories);
            showBasket();
        };
        xhrClient('API/GET/categories.php?empty=false', catCallback);
    }

    function showProducts () {
        loadCategories();
        s.featureTitle.innerHTML = 'Latest Products';
        s.dynamicArea.classList.add('loading');
        window.history.pushState(null, s.shopName, '');
        var callback = function (responseText) {
            var productsArray = JSON.parse(responseText);
            s.dynamicArea.innerHTML = styleProducts(productsArray);
            s.dynamicArea.classList.remove('loading');
            enableLiveSearch(productsArray);
            var categoryListener = function (e) {
                if (parseInt(e.target.id))  {
                    filterProducts(productsArray, e.target.id, e.target.firstChild.textContent);
                }
            };
            s.sideMenu.addEventListener('click', categoryListener);
        };
        xhrClient('API/GET/products.php', callback);
    }

    function enableLiveSearch (productsArray) {
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
                s.dynamicArea.innerHTML = styleProducts(matches);
            } else {
                s.dynamicArea.innerHTML = '<p>No matches, sorry!</p>';
            }
        });
    }

    function showBasket () {
        var basket = localStorage.BASKET;
        if (basket !== undefined) {
            var items = JSON.parse(basket);
            s.basket.innerHTML = styleBasket(items);
            s.basket.addEventListener('click', manageBasket);
        }
    }

    function manageBasket () {
        var basket = JSON.parse(localStorage.BASKET);
        s.dynamicArea.innerHTML = styleBasketTable(basket);
        s.featureTitle.innerHTML = 'My Basket';
    }


    function filterProducts (productsArray, categoryID, categoryName) {
        window.history.pushState({cat:categoryID}, 'Category View', '');
        var backFunction = function () {
            window.removeEventListener('popstate', backFunction);
            showProducts();
        };
        window.addEventListener('popstate', backFunction);
            var matches = [];
            if (categoryID === '-1') {
                s.dynamicArea.innerHTML = styleProducts(productsArray);
                s.featureTitle.innerHTML = 'All Products';
            } else {
                for (var i = productsArray.length - 1; i >= 0; i--) {
                    var product = productsArray[i];
                    if (product.CATEGORY_ID == categoryID) {
                        matches.push(product);
                    }
                }
                s.dynamicArea.innerHTML = styleProducts(matches);
                s.featureTitle.innerHTML = categoryName;
            }
    }

    function showProduct (productID) {
        s.sideMenu.innerHTML = '<li id="backButton">Back</li>';
        var backListener = function (e) {
            if (e.target.id === 'backButton') {
                s.sideMenu.removeEventListener('click', backListener);
                window.history.back();}
        };
        s.sideMenu.addEventListener('click', backListener);
        showBasket();
        var callback = function (responseText) {
            if (typeof responseText !== 'number') {
                var product = JSON.parse(responseText);
                s.dynamicArea.innerHTML = styleProduct(product);
                s.featureTitle.innerHTML = product.PRODUCT_NAME;
                window.history.pushState(null, product.PRODUCT_NAME, 'product.php?id=' + product.PRODUCT_ID);
                window.onpopstate = showProducts;
                var addToBasketButton = document.getElementById('addToBasket');
                addToBasketButton.addEventListener('click', function () {
                    addToBasket(product, 3);
                });
            } else {s.dynamicArea.innerHTML = '<p>Sorry, that product couldn\'t be retrieved.</p>';}
        };
        xhrClient('API/GET/product.php?id=' + productID, callback);
        return false;
    }

    function addToBasket (product, quantity) {
        var newItem = {
            PRODUCT_ID: product.PRODUCT_ID,
            PRODUCT_PRICE: product.PRODUCT_PRICE,
            PRODUCT_QUANTITY: quantity
        };
        var item = JSON.stringify(newItem);
        if (localStorage.BASKET !== undefined) {
            var basket = JSON.parse(localStorage.BASKET);
            basket.push(item);
            localStorage.BASKET = JSON.stringify(basket);
        } else {
            var newBasket = [];
            newBasket.push(item);
            localStorage.BASKET = JSON.stringify(newBasket);
        }
        showBasket();

        
    }

    /******************************* 
    HTML Generation Functions
    ********************************/

    function styleBasket (products) {
        var productsCount = products.length + ' Product';
        if (products.length > 1) {productsCount += 's';}
        var totalCost = 0.00;
        for (var i = products.length - 1; i >= 0; i--) {
            var product = JSON.parse(products[i]);
            totalCost += parseFloat(product.PRODUCT_PRICE);
        }
        return '<li><p>' + productsCount + ' in Basket</p><p>Total cost: £' + totalCost + '</p><p>Edit/Checkout?</p></li>';
    }

    function styleBasketTable (basket) {
        var returnString = '<table id="productsTable"><caption>Summary</caption><thead><tr><th>Product Name</th><th>Product Thumbnail</th><th>Product Price</th><th>Product Quantity</th><th>Quantity Cost</th><th class="update">Update</th></tr></thead><tbody id="basketTableBody"></tbody></table>';
        var loadProduct = function (response, quantity) {
            var productDetails = JSON.parse(response);
            var quantityCost = productDetails.PRODUCT_PRICE * quantity;
            document.getElementById('basketTableBody').innerHTML += '<tr><td>' + productDetails.PRODUCT_NAME + '</td><td class="thumbnail"><img src="' + productDetails.PRODUCT_IMAGE + '" alt="' + productDetails.PRODUCT_NAME + '">' + '<td>' + productDetails.PRODUCT_PRICE + '</td><td>'+ quantity + '</td><td>'+ quantityCost.toFixed(2) + '</td><td>NYI</td></tr>';
        };
        for (var i = basket.length - 1; i >= 0; i--) {
            var product = JSON.parse(basket[i]);
            xhrClient('API/GET/product.php?id=' + product.PRODUCT_ID, loadProduct, product.PRODUCT_QUANTITY);
        }
        return returnString;
    }


    function styleProduct (product) {
        var formattedProduct = '<div id="product">' +
                           '<img src="' + product.PRODUCT_IMAGE + '" alt="' + product.PRODUCT_NAME + '">' +
                           '<div id="product-details">' +
                           '<p id="description">' + product.PRODUCT_DESCRIPTION + '</p>' +
                           '<p id="stock">Stock: ' + product.PRODUCT_STOCK + '</p>' +
                           '<p id="price">Price: ' + product.PRODUCT_PRICE + '</p>' +
                           '<button id="addToBasket">Add to Basket!</button></div>';
        return formattedProduct;
    }

    function styleProducts (productsArray) {
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
        return formattedProducts;
    }

    function styleCategories (categoriesArray) {
        var formattedCategories = '<li class="category" id="-1">Show All</li>';
        for (var i = 0; i < categoriesArray.length; i++) {
            var category = categoriesArray[i];
            formattedCategories += '<li class="category" id="' + category.CATEGORY_ID +
                                    '">'+ category.CATEGORY_NAME + '</li>';
        }
        return formattedCategories;
    }



    return {
        pageLoaded: pageLoaded,
        showProduct: showProduct,
        xhrClient: xhrClient,
        manageBasket: manageBasket
    };
}();

window.addEventListener('load', OnShop.functions.pageLoaded);