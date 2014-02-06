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
        showDefaultHomepage();
    }

    function xhrClient (source, callback) {
    var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status == '200' || this.status == '304') {
                callback(this.response);
            } else {
                callback(this.status);
            }
        };
    xhr.open('GET', source, true);
    xhr.onerror = function () {return 'XHR Error'; };
    xhr.send();
    }


    function showDefaultHomepage () {
        var catCallback = function (responseText) {
            var categories = JSON.parse(responseText);
            s.sideMenu.innerHTML = styleCategories(categories);
            showBasket();
        };
        xhrClient('API/GET/categories.php?empty=false', catCallback);
        s.featureTitle = 'Latest Products';
        s.dynamicArea.classList.add('loading');
        window.history.pushState(null, s.shopName, null);
        var callback = function (responseText) {
            var productsArray = JSON.parse(responseText);
            s.dynamicArea.innerHTML = styleProducts(productsArray);
            s.dynamicArea.classList.remove('loading');
            enableLiveSearch(s.dynamicArea, productsArray);
            var categoryListener = function (e) {
                if (parseInt(e.target.id))  {
                    filterProducts(productsArray, e.target.id);
                }
            };
            s.sideMenu.addEventListener('click', categoryListener);
        };
        xhrClient('API/GET/products.php', callback);
    }

    function showBasket () {
        var basketCookie = getBasketCookie();
        if (basketCookie === null) {
            newBasketCookie();
        } else {
            var basketID = basketCookie.substring(13,basketCookie.length);
            var callback = function (response) {
                if (response !== 204) {
                    var products = JSON.parse(response);
                    s.basket.innerHTML = styleBasket(products);
                    s.basket.addEventListener('click', manageBasket);
                }
            };
            xhrClient('API/GET/basket.php?basket_id=' + basketID, callback);
        }
    }

    function manageBasket () {
        var basketCookie = getBasketCookie();
        var basketID = basketCookie.substring(13,basketCookie.length);
        xhrClient('API/GET/basket.php?basket_id=' + basketID, function (response) {
            s.dynamicArea.innerHTML = styleBasketTable(JSON.parse(response));
        });
    }

    function getBasketCookie () {
        var cookies = document.cookie.split(';');
        for (var i = cookies.length - 1; i >= 0; i--) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf('OnShopBasket') === 0) {
                return cookie;
            }
        }
        return null;
    }

    function newBasketCookie () {
        xhrClient('API/GET/basket.php', function (responseText) {
            var basketID = responseText;
            document.cookie = 'OnShopBasket=' + basketID + ';max-age=15768000;expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/';
        });
    }

    function enableLiveSearch (target, productsArray) {
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

    function filterProducts (productsArray, categoryID) {
            var matches = [];
            if (categoryID == -1) {
                s.dynamicArea.innerHTML = styleProducts(productsArray);
            } else {
                for (var i = productsArray.length - 1; i >= 0; i--) {
                    var product = productsArray[i];
                    if (product.CATEGORY_ID == categoryID) {
                        matches.push(product);
                    }
                }
                s.dynamicArea.innerHTML = styleProducts(matches);
            }
    }

    function showProduct (productID) {
        s.sideMenu.innerHTML = '<li id="backButton">Back</li>';
        var backListener = function (e) {
            if (e.target.id === 'backButton') {window.history.back();}
        };
        s.sideMenu.addEventListener('click', backListener);
        showBasket();
        var callback = function (responseText) {
            var product = JSON.parse(responseText);
            s.dynamicArea.innerHTML = styleProduct(product);
            s.featureTitle.innerHTML = product.PRODUCT_NAME;
            document.title = product.PRODUCT_NAME;
            window.history.pushState(null, product.PRODUCT_NAME, 'product.php?id=' + product.PRODUCT_ID);
            window.onpopstate = showDefaultHomepage;
            var addToBasketButton = document.getElementById('addToBasket');
            addToBasketButton.addEventListener('click', function () {
                addToBasket(product);
            });
        };
        xhrClient('API/GET/product.php?id=' + productID, callback);
        return false;
    }

    function addToBasket (product) {
        var basketCookie = getBasketCookie();
        var basketID = basketCookie.substring(13,basketCookie.length);
        var formData = new FormData();
        formData.append('basket_id', basketID);
        formData.append('product_id', product.PRODUCT_ID);
        formData.append('action', 'add');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'API/POST/basket.php', true);
        xhr.onload = function () {
            if (this.status === 200 || this.status === 304) {
                showBasket();
            } else {
                s.basket.innerHTML = ('Something went wrong');
            }
        };
        xhr.send(formData);
    }

    /******************************* 
    HTML Generation Functions
    ********************************/

    function styleBasket (products) {
        var productsCount = products.length + ' Product';
        if (products.length > 1) {productsCount += 's';}
        var totalCost = 0.00;
        for (var i = products.length - 1; i >= 0; i--) {
            var product = products[i];
            totalCost += product.PRODUCT_PRICE;
        }
        return '<li><p>' + productsCount + ' in Basket</p><p>Total cost: £' + totalCost + '</p><p>Checkout?</p></li>';
    }

    // This might be a very silly way to do this. SEPERATE CONCERNS.
    function styleBasketTable (basket) {
        var returnString = '<table id="productsTable"><caption>Summary</caption><thead><tr><th>Product Name</th><th>Product Thumbnail</th><th>Product Price</th><th>Product Quantity</th><th>Quantity Cost</th><th class="update">Update</th></tr></thead><tbody id="basketTableBody"></tbody></table>';
        var addProduct = function (response) {
            var productDetails = JSON.parse(response);
            document.getElementById('basketTableBody').innerHTML += '<tr><td>' + productDetails.PRODUCT_NAME + '</td><td id="thumbnail"><img src="' + productDetails.PRODUCT_IMAGE + '" alt="' + productDetails.PRODUCT_NAME + '">' +
                            '<td>' + productDetails.PRODUCT_PRICE + '</td><td>NYI</td><td>NYI</td><td>NYI</td></tr>';
        };
        for (var i = basket.length - 1; i >= 0; i--) {
            var product = basket[i];
            xhrClient('API/GET/product.php?id=' + product.PRODUCT_ID, addProduct);
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
        showDefaultHomepage: showDefaultHomepage,
        manageBasket: manageBasket
    };
}();
