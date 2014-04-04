// create a namespace for the JS, and ensure nothing is overwritten.
var onShop = onShop || {};

onShop.functions = function () {
    'use strict';

    var basketArray, productsArray, s = {
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
        } else if (document.URL.indexOf('basket') > -1) {
            manageBasket();
            showBasket();
        }
        else {
            var gets = window.location.search;
            if ((gets.indexOf('?id') > -1)) {
                var id = gets.split('=');
                showProduct(id[id.length-1]);
            } else {showProducts();}
        }
    }

    function xhrError (error) {
        showFeedback('Internal error: ' + error, 'error');
    }


    function loadCategories () {
        var catCallback = function (r) {
            var categories = JSON.parse(r.target.responseText);
            s.sideMenu.innerHTML = styleCategories(categories);
            showBasket();
        };
        onShop.XHR.load(
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
        interval.unsetAll();
        loadCategories();
        s.featureTitle.innerHTML = 'Latest Products';
        s.dynamicArea.classList.add('loading');
        window.history.pushState(null, s.shopName, 'index.php');
        var callback = function (r) {
            productsArray = JSON.parse(r.target.responseText);
            s.dynamicArea.innerHTML = styleProducts(productsArray);
            s.dynamicArea.classList.remove('loading');
            enableLiveSearch(productsArray);
            var categoryListener = function (e) {
                if (parseInt(e.target.id))  {
                    filterProducts(e.target.id, e.target.firstChild.textContent);
                }
            };
            s.sideMenu.addEventListener('click', categoryListener);
        };
        onShop.XHR.load(
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
        searchBox.disabled = false;
        // Prevent submitting the search form.
        searchBox.addEventListener('keydown', function (e) {
            if (e.keyCode == '13') {e.preventDefault();}
        });
        searchBox.addEventListener('keyup', function () {
            var strings = searchBox.value.toLowerCase().split(' ');
            var matches = [];
            for (var i = productsArray.length - 1; i >= 0; i--) {
                var product = productsArray[i];
                var productDescription = product.PRODUCT_DESCRIPTION.toLowerCase();
                var productName = product.PRODUCT_NAME.toLowerCase();
                var misses = 0;
                for (var j = strings.length - 1; j >= 0; j--) {
                    var string = strings[j];
                    if (!(productDescription.indexOf(string) >= 0 || productName.indexOf(string) >= 0)) {
                        misses++;
                    }
                    var productDOM = document.getElementById('product' + productsArray[i].PRODUCT_ID);
                    if (misses > 0) {
                        productDOM.classList.add('flipOut');
                    } else {
                        productDOM.classList.remove('flipOut');
                        matches.push(product);
                    }
                }
            }
            if (matches.length === 0) {
                showFeedback('Sorry, no matching products!', 'notice');
            }
        });
    }

    function disableLiveSearch () {
        var searchBox = document.getElementById('search');
        searchBox.disabled = true;
    }

    var interval = {
        // to keep track of the intervals.
        intervals: [],
        set : function (func, delay) {
            var intervalID = window.setInterval(func, delay);
            this.intervals.push(intervalID);
        },
        unset : function (id) {
            window.clearInterval(id);
            for (var i = this.intervals.length - 1; i >= 0; i--) {
                if (id == this.intervals[i]) {
                    this.intervals.splice(i,1);
                }
            }
        },
        unsetAll : function () {
            for (var i = this.intervals.length - 1; i >= 0; i--) {
                window.clearInterval(this.intervals[i]);
            }
            this.intervals = [];
        }
    };

    function showBasket () {
        if (localStorage.BASKET) {
            var items = JSON.parse(localStorage.BASKET);
            s.basket.innerHTML = styleBasket(items);
            s.basket.addEventListener('click', manageBasket);
        } else s.basket.innerHTML = '<li><p>No Products in Basket.</p><p>Why not buy some stuff?!</p></li>';
    }

    function changeStock (product, amount, add) {
        var change, callback, fail;
        if (add) {
            callback = function (r) {
                if (r.target.status == '200') {
                    addToBasket(product, amount);
                    refreshStock(product.PRODUCT_ID);
                } else fail();
            };
            fail = function () {
                showFeedback('Error with stock levels. Please reload.');
            };
            change = -amount;
        } else {
            callback = function () {};
            fail = function (e) {xhrError(e);};
            change = amount;
        }
        onShop.XHR.load({
            'accept': 'text/html',
            'data': {
                'id': product.PRODUCT_ID,
                'stockChange': change
            },
            'method': 'PATCH',
            'url': 'api/1/product/',
            'callbacks': {
                'load': callback,
                'error': fail
            }
        });
    }

    function addBackButton () {
        s.sideMenu.innerHTML = '<li id="backButton">Back To Products</li>';
        var backListener = function (e) {
            if (e.target.id === 'backButton') {
                s.sideMenu.removeEventListener('click', backListener);
                showProducts();}
        };
        s.sideMenu.addEventListener('click', backListener);
    }

    function manageBasket () {
        if (localStorage.BASKET) {
            addBackButton();
            disableLiveSearch();
            interval.unsetAll();
            window.history.pushState(null, 'My Basket', 'basket.php');
            var deleteItem = function (e) {
                if (e.target.type == 'submit' && parseInt(e.target.parentNode.parentNode.id)) {
                    var basket = JSON.parse(localStorage.BASKET);
                    var newBasket = [];
                    for (var i = basket.length - 1; i >= 0; i--) {
                        var item = JSON.parse(basket[i]);
                        if (item.PRODUCT_ID != e.target.parentNode.parentNode.id) {
                            newBasket.push(JSON.stringify(item));
                        } else {
                            changeStock(item, item.PRODUCT_QUANTITY, false);
                        }
                    }
                    localStorage.BASKET = JSON.stringify(newBasket);
                    showBasket();
                    manageBasket();
                    // It would be nice to send a "heartbeat" from the client basket to monitor activity.
                }
            };
            var basket = JSON.parse(localStorage.BASKET);
            s.dynamicArea.innerHTML = styleBasketTable(basket);
            s.featureTitle.innerHTML = 'My Basket';
            // The event listener is in the AJAX return call to avoid loss on DOM change.
            var loadForm = function (r) {
                s.dynamicArea.innerHTML += '<hr>' + r.target.responseText;
                var table = document.getElementById('basketTable');
                table.addEventListener('click', deleteItem);
                var sendOrder = function (e) {
                    e.preventDefault();
                    if (e.target.checkValidity()) {submitOrder(e.target);}
                };
                document.getElementById('orderForm').addEventListener('submit', sendOrder);
            };
            onShop.XHR.load(
                {
                    'url': 'inc/orderform.php',
                    'callbacks': {
                        'load': loadForm,
                        'error': xhrError
                    }
                }
            );
        } else {
            s.dynamicArea.innerHTML = '<a href="index.php"><button>Nothing here! Let\'s look at some products...</button>';
        }
    }


    function filterProducts (categoryID, categoryName) {
        window.history.pushState({cat:categoryID}, 'Category View', '');
        var backFunction = function () {
            window.removeEventListener('popstate', backFunction);

        };
        var unhideAll = function () {
            for (var i = productsArray.length - 1; i >= 0; i--) {
                var product = productsArray[i];
                var productDOM = document.getElementById('product' + product.PRODUCT_ID);
                productDOM.classList.remove('flipOut');
            }
        };
        window.addEventListener('popstate', backFunction);
            if (categoryID === '-1') {
                unhideAll();
                s.featureTitle.innerHTML = 'All Products';
            } else {
                for (var i = productsArray.length - 1; i >= 0; i--) {
                    var product = productsArray[i];
                    var productDOM = document.getElementById('product' + product.PRODUCT_ID);
                    if (product.CATEGORY_ID == categoryID) {
                        productDOM.classList.remove('flipOut');
                    } else {
                        productDOM.classList.add('flipOut');
                    }
                }
                s.featureTitle.innerHTML = categoryName;
            }
    }

    function showProduct (productID) {
        addBackButton();
        showBasket();
        var addToBasketListener = function (product) {
            var quantity = document.getElementById('quantity').value;
            changeStock(product, quantity, true);
        };
        var callback = function (r) {
            if (typeof r.target.responseText !== 'number') {
                var product = JSON.parse(r.target.responseText);
                s.dynamicArea.innerHTML = styleProduct(product);
                s.featureTitle.innerHTML = product.PRODUCT_NAME;
                window.history.pushState(null, product.PRODUCT_NAME, 'product.php?id=' + product.PRODUCT_ID);
                window.onpopstate = showProducts;
                var addToBasketButton = document.getElementById('addToBasket');
                addToBasketButton.addEventListener('click', function() {addToBasketListener(product);});
                var wrapFunction = function () {
                    refreshStock(productID);
                };
                interval.set(wrapFunction, 8000);
            } else {s.dynamicArea.innerHTML = '<p>Sorry, that product couldn\'t be retrieved.</p>';}
        };
        onShop.XHR.load(
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

    function refreshStock (productID) {
        var updateStock = function (r) {
            var stock = parseInt(r.target.responseText);
            document.getElementById('stock').innerHTML = 'Stock: ' + stock;
            var selector = document.getElementById('quantity');
            if (stock === 0) {
                selector.disabled = true;
                document.getElementById('addToBasket').disabled = true;
            }
            if (selector.length > stock) {
                for (var i = selector.length; i >= stock; i--) {
                    selector.remove(i);
                }
            } else if (selector.length < stock) {
                for (var j = selector.length + 1 ; j <= stock; j++) {
                    var option = document.createElement('option');
                    option.text = j;
                    selector.add(option);
                }
                selector.disabled = false;
                document.getElementById('addToBasket').disabled = false;
            }
        };
        onShop.XHR.load({
            'url': 'api/1/product/' + productID + '/stock',
            'callbacks': {
                'load': updateStock,
                'error': xhrError
            }
        });
    }

    function addToBasket (product, quantity) {
        var newItem = {
            PRODUCT_ID: product.PRODUCT_ID,
            PRODUCT_PRICE: product.PRODUCT_PRICE,
            PRODUCT_QUANTITY: quantity
        };
        if (localStorage.BASKET) {
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
        
    }

    function submitOrder (form) {
        var formData = new FormData(form);
        formData.append('customer-order', JSON.stringify(basketArray));
        var callback = function (r) {
            showFeedback(r.target.responseText);
            localStorage.removeItem('BASKET');
            showBasket();
            styleOrderSuccess();
        };
        onShop.XHR.load({
            'method': 'POST',
            'url': form.action,
            'data': formData,
            'callbacks': {
                'load': callback,
                'error': xhrError
            }
        });
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
        if (products.length === 0) {
            return '<li><p>No Products in Basket.</p><p>Why not buy some stuff?!</p></li>';
        }
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
        basketArray = [];
        var returnString = '<table class="productTable" id="basketTable"><caption>Summary</caption><thead><tr><th>Product Name</th><th>Product Thumbnail</th><th>Product Price</th><th>Product Quantity</th><th>Quantity Cost</th><th class="update">Update</th></tr></thead><tbody id="basketTableBody"></tbody></table>';
        var loadProduct = function (r, args) {
            if (r.target.status == 204) {document.getElementById('basketTableBody').innerHTML += '<tr id="' + args.pid +'"><td colspan="5">Sorry, item ' + args.pid + ' could not be found. It may have been removed.</td><td><button class="removeItem">Remove</button></td></tr>';}
            else {
                var basketProduct = [];
                var productDetails = JSON.parse(r.target.responseText);
                var quantityCost = productDetails.PRODUCT_PRICE * args.quantity;
                basketProduct.push(args.pid, productDetails.PRODUCT_NAME, productDetails.PRODUCT_PRICE, args.quantity, quantityCost);
                basketArray.push(JSON.stringify(basketProduct));
                document.getElementById('basketTableBody').innerHTML += '<tr id="' + args.pid +'"><td><a href="product.php?id=' + args.pid + '">' + productDetails.PRODUCT_NAME + '</a></td><td class="thumbnail"><img src="' + productDetails.PRODUCT_IMAGE + '" alt="' + productDetails.PRODUCT_NAME + '">' + '<td>' + productDetails.PRODUCT_PRICE + '</td><td>'+ args.quantity + '</td><td>'+ quantityCost.toFixed(2) + '</td><td><button class="removeItem">Remove</button></td></tr>';
            }
        };
        for (var i = basket.length - 1; i >= 0; i--) {
            var product = JSON.parse(basket[i]);
            onShop.XHR.load(
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
                            'onclick="return onShop.functions.showProduct(' + product.PRODUCT_ID + ');"' +
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

    function styleOrderSuccess () {
        s.dynamicArea.innerHTML = '<h3>Order Successful!</h3><p>Thank you for your order. We\'ll do our best to get it to you as soon as possible.</p>' +
        '<p>We\'ll contact you via email should there be any changes or queries regarding your order, so keep an eye on that inbox!</p>';
    }

    return {
        pageLoaded: pageLoaded,
        showProduct: showProduct,
        manageBasket: manageBasket,
        showFeedback: showFeedback
    };
}();

window.addEventListener('load', onShop.functions.pageLoaded);
