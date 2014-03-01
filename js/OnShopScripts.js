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

    var productsArray;

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

    function xhrError (error) {
        showFeedback('Internal error: ' + error, error);
    }


    function loadCategories () {
        var catCallback = function (r) {
            var categories = JSON.parse(r.target.responseText);
            s.sideMenu.innerHTML = styleCategories(categories);
            showBasket();
        };
        OnShop.XHR.load(
            {
                'url': 'api/1/categories/nonempty',
                'callbacks': {
                    'load': catCallback,
                    'error': xhrError
                }
            }
        );
    }

    function showProducts () {
        loadCategories();
        s.featureTitle.innerHTML = 'Latest Products';
        s.dynamicArea.classList.add('loading');
        window.history.pushState(null, s.shopName, '');
        var callback = function (r) {
            productsArray = JSON.parse(r.target.responseText);
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
        OnShop.XHR.load(
            {
                'url': 'api/1/products/',
                'callbacks': {
                    'load': callback,
                    'error': xhrError
                }
            }
        );

    }

    function enableLiveSearch () {
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
                    var show = document.getElementById('product' + productsArray[i].PRODUCT_ID);
                    show.classList.remove('vanish');
                } else {
                    var hide = document.getElementById('product' + productsArray[i].PRODUCT_ID);
                    hide.classList.add('vanish');
                }
            }
            if (matches.length === 0) {
                s.dynamicArea.innerHTML.append('<p>Sorry, no matching products!</p>');
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
        var deleteItem = function (e) {
            if (parseInt(e.target.parentNode.parentNode.id)) {
                var basket = JSON.parse(localStorage.BASKET);
                var newBasket = [];
                for (var i = basket.length - 1; i >= 0; i--) {
                    var item = JSON.parse(basket[i]);
                    if (item.PRODUCT_ID != e.target.parentNode.parentNode.id) {
                        newBasket.push(JSON.stringify(item));
                    } else {
                        var product = item;
                    }
                }
                localStorage.BASKET = JSON.stringify(newBasket);
                showBasket();
                manageBasket();
                // add stock back to database!
                // need to get stock and add quantity to it...
                // heartbeat? oh man.
            }
        };
        s.dynamicArea.innerHTML = styleBasketTable(basket);
        s.featureTitle.innerHTML = 'My Basket';
        var target = document.getElementById('productsTable');
        target.addEventListener('click', deleteItem);
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
        var callback = function (r) {
            if (typeof responseText !== 'number') {
                var product = JSON.parse(r.target.responseText);
                s.dynamicArea.innerHTML = styleProduct(product);
                s.featureTitle.innerHTML = product.PRODUCT_NAME;
                window.history.pushState(null, product.PRODUCT_NAME, 'product.php?id=' + product.PRODUCT_ID);
                window.onpopstate = showProducts;
                var addToBasketButton = document.getElementById('addToBasket');
                addToBasketButton.addEventListener('click', function () {
                    var quantity = document.getElementById('quantity').value;
                    addToBasket(product, quantity);
                });
            } else {s.dynamicArea.innerHTML = '<p>Sorry, that product couldn\'t be retrieved.</p>';}
        };
        OnShop.XHR.load(
            {
                'url': 'api/1/product/' + productID,
                'callbacks': {
                    'load': callback,
                    'error': xhrError
                }
            }
        );
        return false;
    }

    function addToBasket (product, quantity) {
        var newItem = {
            PRODUCT_ID: product.PRODUCT_ID,
            PRODUCT_PRICE: product.PRODUCT_PRICE,
            PRODUCT_QUANTITY: quantity
        };
        if (localStorage.BASKET !== undefined) {
            var basket = JSON.parse(localStorage.BASKET);
            var found = false;
            for (var i = basket.length - 1; i >= 0; i--) {
                var itemCheck = JSON.parse(basket[i]);
                if (itemCheck.PRODUCT_ID === newItem.PRODUCT_ID) {
                    found = true;
                    itemCheck.PRODUCT_QUANTITY = parseInt(itemCheck.PRODUCT_QUANTITY) + parseInt(newItem.PRODUCT_QUANTITY);
                    basket[i] = JSON.stringify(itemCheck);
                }
            }
            if (!found) {basket.push(JSON.stringify(newItem));}
            localStorage.BASKET = JSON.stringify(basket);
        } else {
            var newBasket = [];
            newBasket.push(JSON.stringify(newItem));
            localStorage.BASKET = JSON.stringify(newBasket);
        }
        showBasket();
        showFeedback('Product added to basket!', 'notice');
        // decrement stock, move add function to callback
        
    }

    /******************************* 
    HTML Generation Functions
    ********************************/

    function showFeedback (feedback, level) {
        var target = document.getElementById('feedback');
        target.innerHTML = '<p><span id="closeFeedback"> X </span>' + feedback + '</p>';
        target.classList.remove('vanish');
        var hideFeedback = function () {
            target.classList.add('vanish');
            target.innerHTML = '';
            window.clearTimeout(timeoutID);
        };
        target.addEventListener('click', function () {
            target.removeEventListener('click', hideFeedback);
            hideFeedback();
        });
        if (level == 'notice') {
            var timeoutID = window.setTimeout(hideFeedback, 3000);
        }
    }

    function styleBasket (products) {
        var productsCount = products.length + ' Product';
        if (products.length > 1) {productsCount += 's';}
        var totalCost = 0.00;
        for (var i = products.length - 1; i >= 0; i--) {
            var product = JSON.parse(products[i]);
            totalCost += parseFloat(product.PRODUCT_PRICE) * parseInt(product.PRODUCT_QUANTITY);
        }
        return '<li><p>' + productsCount + ' in Basket</p><p>Total cost: £' + totalCost.toFixed(2) + '</p><p>Edit/Checkout?</p></li>';
    }

    function styleBasketTable (basket) {
        var returnString = '<table id="productsTable"><caption>Summary</caption><thead><tr><th>Product Name</th><th>Product Thumbnail</th><th>Product Price</th><th>Product Quantity</th><th>Quantity Cost</th><th class="update">Update</th></tr></thead><tbody id="basketTableBody"></tbody></table>';
        var loadProduct = function (r, args) {
            if (typeof response == 'number') {document.getElementById('basketTableBody').innerHTML += '<tr id="' + args.pid +'"><td colspan="5">Sorry, item ' + product.PRODUCT_ID + ' could not be found, it may have been removed!</td><td><button class="removeItem">Remove</button></td></tr>';}
            else {
                var productDetails = JSON.parse(r.target.responseText);
                var quantityCost = productDetails.PRODUCT_PRICE * args.quantity;
                document.getElementById('basketTableBody').innerHTML += '<tr id="' + args.pid +'"><td>' + productDetails.PRODUCT_NAME + '</td><td class="thumbnail"><img src="' + productDetails.PRODUCT_IMAGE + '" alt="' + productDetails.PRODUCT_NAME + '">' + '<td>' + productDetails.PRODUCT_PRICE + '</td><td>'+ args.quantity + '</td><td>'+ quantityCost.toFixed(2) + '</td><td><button class="removeItem">Remove</button></td></tr>';
            }
        };
        for (var i = basket.length - 1; i >= 0; i--) {
            var product = JSON.parse(basket[i]);
            OnShop.XHR.load(
                {
                    'url': 'api/1/product/' + product.PRODUCT_ID,
                    'callbacks': {
                        'load': loadProduct,
                        'error': xhrError
                    },
                    'args': {
                        quantity:product.PRODUCT_QUANTITY,
                        pid:product.PRODUCT_ID
                    }
                }
            );
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
                           styleAvailableStockSelector(product.PRODUCT_STOCK);
        return formattedProduct;
    }

    function styleAvailableStockSelector (stockIn) {
        var stock = parseInt(stockIn);
        if (stock === 0) {
            return '<select disabled id="quantity"><option>0</option></select><button disabled id="addToBasket">Add to Basket!</button></div>';
        } else {
            var returnString = '<select id="quantity">';
            for (var i = 1; i <= stock; i++) {
                returnString += '<option>' + i + '</option>';
            }
            return returnString + '</select><button id="addToBasket">Add to Basket!</button></div>';
        }
    }

    function styleProducts (productsArray) {
        var formattedProducts = '<ul id="products">';
        for (var i = productsArray.length - 1; i >= 0; i--) {
            var product = productsArray[i];
            formattedProducts += '<li id="product'+ product.PRODUCT_ID + '"><a href="' + product.PRODUCT_URL + '"' +
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
        manageBasket: manageBasket,
        showFeedback: showFeedback
    };
}();

window.addEventListener('load', OnShop.functions.pageLoaded);