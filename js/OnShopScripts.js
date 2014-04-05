/** 
    Main JS for the shop functionality.
    Admin and installation functions are in seperate files in this directory.

    @author UP663652
*/

// Create a namespace for the JS, and ensure nothing is overwritten.
var onShop = onShop || {};

onShop.functions = function () {
    // Strict mode helps ensure code correctness.
    'use strict';

    var searchEvent, basketArray, productsArray, s = {
        // HTML IDs for the AJAX DOM locations.
        settings: {
            dynamicArea: 'dynamic-content',
            shopName: document.title,
            sideMenu: 'options',
            featureTitle: 'feature-title',
            basket: 'basket'
        },

        // Now binding the elements to an internal setting object.
        init: function() {
            this.settings.dynamicArea = document.getElementById(this.settings.dynamicArea);
            this.settings.sideMenu = document.getElementById(this.settings.sideMenu);
            this.settings.featureTitle = document.getElementById(this.settings.featureTitle);
            this.settings.basket = document.getElementById(this.settings.basket);
            s = this.settings;
        }

    };

    /** Object to keep track of window intervals.*/
    var interval = {
        // Array to store all intervals.
        intervals: [],
        // Attach a new interval.
        set : function (func, delay) {
            var intervalID = window.setInterval(func, delay);
            this.intervals.push(intervalID);
        },
        // Remove an inverval of specific ID.
        unset : function (id) {
            window.clearInterval(id);
            for (var i = this.intervals.length - 1; i >= 0; i--) {
                if (id == this.intervals[i]) {
                    this.intervals.splice(i,1);
                }
            }
        },
        // Remove all intervals.
        unsetAll : function () {
            // Call clear interval on everything in the object. Attempt to suppress flashbacks of Haskell.
            this.intervals.map(window.clearInterval);
            // Reset the object.
            this.intervals = [];
        }
    };

    /** Called on page load to initiate AJAX locations & check URL. */
    function pageLoaded () {
        s.init();
        checkURL();
    }

    /** Check if the URL specifies admin, basket, or product pages.
        Useful for bookmarks or back/forward navigation. */
    function checkURL() {
        if (document.URL.indexOf('admin') > -1) {
            // Do nothing, admin scripts will take care of this!
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

    /** Show feedback details to the user if any XHR errors happen. */
    function xhrError (error) {
        showFeedback('Internal error: ' + error, 'error');
    }

    /** Load non-empty categories from the API for the side menu. */
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

    /** Load all the products, sorted by date added. Places all products in hoisted productsArray. */
    function showProducts () {
        // Remove any pesky stock-checking intervals that might still be around.
        interval.unsetAll();
        // Get up to date categories.
        loadCategories();
        s.featureTitle.innerHTML = 'Latest Products';
        // Show a loading animation while we wait for the server.
        s.dynamicArea.classList.add('loading');
        // Push history to allow back/forward navigation.
        window.history.pushState(null, s.shopName, 'index.php');
        var callback = function (r) {
            productsArray = JSON.parse(r.target.responseText);
            s.dynamicArea.innerHTML = styleProducts(productsArray);
            // Very hacky way of extracting product numbers. Bah.
            var loadProduct = function (e) {
                e.preventDefault();
                var id = e.target.parentNode.id.replace('product', '');
                if (!parseInt(id)) {
                    showProduct(e.target.parentNode.parentNode.id.replace('product', ''));
                } else showProduct(id);
            };
            // Attach event listeners to all the product boxes.
            var productButtons = document.querySelectorAll('#products li');
            for (var i = 0; i < productButtons.length; i++) {
                productButtons[i].addEventListener('click', loadProduct);
            }
            // Loading done!
            s.dynamicArea.classList.remove('loading');
            enableLiveSearch();
            // If they clicked a category, filter the products down.
            var categoryListener = function (e) {
                if (parseInt(e.target.id))  {
                    filterProducts(e.target.id, e.target.firstChild.textContent);
                }
            };
            s.sideMenu.addEventListener('click', categoryListener);
        };
        onShop.XHR.load({
            'url': 'api/1/products/',
            'callbacks': {
                'load': callback,
                'error': xhrError
            }
        });
    }

    /** Create search functionality that operates on the downloaded product array.
        No AJAX or DB calls necessary. */
    function enableLiveSearch () {
        var searchBox = document.getElementById('search');
        // In case we disabled the search box earlier.
        searchBox.disabled = false;
        // Prevent submitting the search form.
        searchBox.addEventListener('keydown', function (e) {
            if (e.keyCode == '13') {e.preventDefault();}
        });
        // Search the product array as they type. 
        // Using an anonymous hoisted function so we can remove it too.
        searchEvent = function () {
            liveSearch(searchBox);
        };
        searchBox.addEventListener('keyup', searchEvent);
    }

    /** Disable searching on the pages without the products array. */
    function disableLiveSearch () {
        var searchBox = document.getElementById('search');
        searchBox.disabled = true;
        searchBox.removeEventListener('keyup', searchEvent);
    }

    /** Checks the values in the searchbox against the product names and descriptions.
        Supports multiple case-insensitive string searches. */
    function liveSearch (searchBox) {
        // Split the seperate search terms.
        var strings = searchBox.value.toLowerCase().split(' ');
        // Empty array to hold the matching products. Used to check if not 0.
        var matches = [];
        // Checking each product if it matches all of the search terms.
        // 3 nested loops, this probably has impressive efficiency...
        for (var i = productsArray.length - 1; i >= 0; i--) {
            var product = productsArray[i];
            // Case insensitivity.
            var productDescription = product.PRODUCT_DESCRIPTION.toLowerCase();
            var productName = product.PRODUCT_NAME.toLowerCase();
            // Keep track of any non-matching search terms. If increased, product is hidden.
            var misses = 0;
            // Check each string of the search against the product's details.
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
    }

    /** Show a basket underneath the product categories with number of products & cost. */
    function showBasket () {
        // Check the basket exists, or assume they haven't chosen anything.
        if (localStorage.BASKET) {
            var items = JSON.parse(localStorage.BASKET);
            s.basket.innerHTML = styleBasket(items);
            s.basket.addEventListener('click', manageBasket);
        } else s.basket.innerHTML = '<li><p>No Products in Basket.</p><p>Why not buy some stuff!</p></li>';
    }

    /** Update the stock in the database as customers add or remove products from their basket.

        @param add True if adding to basket, false if removing.
    */
    function changeStock (product, amount, add) {
        var change, callback, fail;
        if (add) {
            callback = function (r) {
                // 200 is OK, anything else is unsuccessful basket addition.
                if (r.target.status == '200') {
                    addToBasket(product, amount);
                    refreshStock(product.PRODUCT_ID);
                } else fail();
            };
            // Maybe their client is out of date and that stock is not present anymore.
            fail = function () {
                showFeedback('Error with stock levels. Please reload.');
            };
            // The stock change is negative whatever they added to their basket.
            change = -amount;
        } else {
            // Don't need to show the client anything.
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

    /** Display a back button above side-menu to return them home. */
    function addBackButton () {
        s.sideMenu.innerHTML = '<li id="backButton">Back To Products</li>';
        var backListener = function (e) {
            if (e.target.id === 'backButton') {
                s.sideMenu.removeEventListener('click', backListener);
                showProducts();}
        };
        s.sideMenu.addEventListener('click', backListener);
    }

    /** Display the basket with options to remove items. */
    function manageBasket () {
        // Check the basket exists, if not don't load the order form or table.
        if (localStorage.BASKET) {
            // Stop search and remove any product stock interval checks.
            addBackButton();
            disableLiveSearch();
            interval.unsetAll();
            // Push history for back/forward navigation and bookmarking.
            window.history.pushState(null, 'My Basket', 'basket.php');
            var basket = JSON.parse(localStorage.BASKET);
            s.dynamicArea.innerHTML = styleBasketTable(basket);
            s.featureTitle.innerHTML = 'My Basket';
            // The event listener is in the AJAX return call to avoid loss on DOM change.
            var loadForm = function (r) {
                s.dynamicArea.innerHTML += '<hr>' + r.target.responseText;
                var table = document.getElementById('basketTable');
                table.addEventListener('click', deleteBasketItem);
                // Check there are products in the basket.
                checkForm();
                var sendOrder = function (e) {
                    e.preventDefault();
                    if (e.target.checkValidity()) {
                        submitOrder(e.target);
                    }
                };
                var orderForm = document.getElementById('orderForm');
                orderForm.addEventListener('submit', sendOrder);
                // Paranoid check that the form is still correct.
                orderForm.addEventListener('keyup', checkForm);
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
            // They're not supposed to be here! Push them in the right direction...
            s.dynamicArea.innerHTML = '<a href="index.php"><button>Nothing here! Let\'s look at some products...</button>';
        }
    }

    /** Check there are products in the basketArray and activate the submit button as necessary. */
    function checkForm() {
        var submitButton = document.querySelector('#orderForm #submit');
        if (basketArray.length < 1) {
            submitButton.disabled = true;
        } else {
            submitButton.disabled = false;
        }
    }

    /** Remove an item from the basket and add the stock back through a changeStock call.

        @param e Event fired from clicking anywhere on the basket table.
    */
    function deleteBasketItem (e) {
        // Check what they clicked!
        if (e.target.type == 'submit' && parseInt(e.target.parentNode.parentNode.id)) {
            var basket = JSON.parse(localStorage.BASKET);
            var newBasket = [];
            for (var i = basket.length - 1; i >= 0; i--) {
                var item = JSON.parse(basket[i]);
                // Check if they clicked something appropriate. 
                if (item.PRODUCT_ID != e.target.parentNode.parentNode.id) {
                    newBasket.push(JSON.stringify(item));
                } else {
                    changeStock(item, item.PRODUCT_QUANTITY, false);
                }
            }
            localStorage.BASKET = JSON.stringify(newBasket);
            showBasket();
            manageBasket();
        }
    }

    /** Filters the productArray for matching categories, hides non-matching. */
    function filterProducts (categoryID, categoryName) {
        // Try to display appropriate page titles and history events. 
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

    /** Load a specific product of that ID. */
    function showProduct (productID) {
        addBackButton();
        showBasket();
        // Update stock when customer adds product to basket.
        var addToBasketListener = function (product) {
            var quantity = document.getElementById('quantity').value;
            changeStock(product, quantity, true);
        };
        var callback = function (r) {
            // 200 means the product was found, anything else is a unmatching ID.
            if (r.target.status == '200') {
                var product = JSON.parse(r.target.responseText);
                s.dynamicArea.innerHTML = styleProduct(product);
                s.featureTitle.innerHTML = product.PRODUCT_NAME;
                window.history.pushState(null, product.PRODUCT_NAME, 'product.php?id=' + product.PRODUCT_ID);
                window.onpopstate = showProducts;
                var addToBasketButton = document.getElementById('addToBasket');
                addToBasketButton.addEventListener('click', function() {addToBasketListener(product);});
                // Create an interval to check stock.
                var checkStock = function () {
                    refreshStock(productID);
                };
                interval.set(checkStock, 8000);
            } else {s.dynamicArea.innerHTML = '<p>Sorry, that product couldn\'t be retrieved.</p>';}
        };
        onShop.XHR.load({
            'url': 'api/1/product/' + productID,
            'callbacks': {
                'load': callback,
                'error': xhrError
            }
        });
    }

    /** Update the stock count of the product. Updates the selection drop down to current availability. */
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

    /** Add the product to their JSON LocalStorage basket as a JSON object. */
    function addToBasket (product, quantity) {
        var newItem = {
            PRODUCT_ID: product.PRODUCT_ID,
            PRODUCT_PRICE: product.PRODUCT_PRICE,
            PRODUCT_QUANTITY: quantity
        };
        if (localStorage.BASKET) {
            var basket = JSON.parse(localStorage.BASKET);
            var found = false;
            // Check if the product is already in their basket and change the quantity if found.
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

    /** Submit the order to the API. If successful, resets the customer basket. */
    function submitOrder (form) {
        var formData = new FormData(form);
        formData.append('customer-order', JSON.stringify(basketArray));
        var callback = function (r) {
            if (r.target.status == '200') {
                showFeedback(r.target.responseText, 'notice');
                addSales(basketArray);
                localStorage.removeItem('BASKET');
                showBasket();
                styleOrderSuccess();
            } else showFeedback('Sorry - order failed, please try again in a moment.');
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

    function addSales (basket) {
        var saleMap = function (product) {
            var p = JSON.parse(product);
            onShop.XHR.load({
                'data': {
                    'id': p[0],
                    'sales': p[3]
                },
                'method': 'PATCH',
                'url': 'api/1/product/',
                'callbacks': {
                    'error': xhrError
                }
            });
        };
        basket.map(saleMap);
    }

    /******************************* 
     HTML Generation Functions
    ********************************/

    /** 
        Displays a feedback bar to the user.

        @param level If set to 'notice', then the feedback bar will hide itself after 3s.
    */
    function showFeedback (feedback, level) {
        var target = document.getElementById('feedback');
        target.innerHTML = '<p><span id="closeFeedback"> X </span>' + feedback + '</p>';
        target.classList.remove('vanish');
        var hideFeedback = function () {
            target.classList.add('vanish');
            target.innerHTML = '';
            // Remove the associated timer.
            window.clearTimeout(timeoutID);
        };
        target.addEventListener('click', function () {
            target.removeEventListener('click', hideFeedback);
            hideFeedback();
        });
        // Used for non-critical messages. Multiple levels could be added in the future.
        if (level == 'notice') {
            var timeoutID = window.setTimeout(hideFeedback, 3000);
        }
    }

    /** Style the basket displayed below the categories. Works out total quantity costs. */
    function styleBasket (products) {
        if (products.length === 0) {
            return '<li><p>No Products in Basket.</p><p>Why not buy some stuff!</p></li>';
        }
        var productsCount = products.length + ' Product';
        // Add an 's' to 'Product' if plural.
        if (products.length > 1) {productsCount += 's';}
        var totalCost = 0.00;
        for (var i = products.length - 1; i >= 0; i--) {
            var product = JSON.parse(products[i]);
            totalCost += parseFloat(product.PRODUCT_PRICE) * parseInt(product.PRODUCT_QUANTITY);
        }
        return '<li><p>' + productsCount + ' in Basket</p><p>Total cost: £' + totalCost.toFixed(2) + '</p><p>Edit/Checkout?</p></li>';
    }

    /** Show the JSON basket as a table. Loads the details from the API for matching product IDs.
        This helps ensure information is up to date and that the client hasn't made up their own prices! */
    function styleBasketTable (basket) {
        basketArray = [];
        var returnString = '<table class="productTable" id="basketTable"><caption>Summary</caption><thead><tr><th>Product Name</th><th>Product Thumbnail</th><th>Product Price</th><th>Product Quantity</th><th>Quantity Cost</th><th class="update">Update</th></tr></thead><tbody id="basketTableBody"></tbody></table>';
        var loadProduct = function (r, args) {
            // If we got '204 No Content' from the API, that product was not found.
            if (r.target.status == 204) {document.getElementById('basketTableBody').innerHTML += '<tr id="' + args.pid +'"><td colspan="5">Sorry, item ' + args.pid + ' could not be found. It may have been removed.</td><td><button class="removeItem">Remove</button></td></tr>';}
            else {
                var basketProduct = [];
                var productDetails = JSON.parse(r.target.responseText);
                var quantityCost = productDetails.PRODUCT_PRICE * args.quantity;
                basketProduct.push(args.pid, productDetails.PRODUCT_NAME, productDetails.PRODUCT_PRICE, parseInt(args.quantity), quantityCost);
                // basketArray is a hoisted variable with their current items in, used for sending the order. 
                // This is a security issue as client can change details again. :-(.
                basketArray.push(JSON.stringify(basketProduct));
                document.getElementById('basketTableBody').innerHTML += '<tr id="' + args.pid +'"><td><a href="product.php?id=' + args.pid + '">' + productDetails.PRODUCT_NAME + '</a></td><td class="thumbnail"><img src="' + productDetails.PRODUCT_IMAGE + '" alt="' + productDetails.PRODUCT_NAME + '">' + '<td>' + productDetails.PRODUCT_PRICE + '</td><td>'+ args.quantity + '</td><td>'+ quantityCost.toFixed(2) + '</td><td><button class="removeItem">Remove</button></td></tr>';
            }
        };
        // AJAX call to get product details for the basket item.
        var getProductDetails = function(p) {
            var product = JSON.parse(p);
            onShop.XHR.load({
                'url': 'api/1/product/' + product.PRODUCT_ID,
                'callbacks': {
                    'load': loadProduct,
                    'error': xhrError
                },
                'args': {
                    quantity:product.PRODUCT_QUANTITY,
                    pid:product.PRODUCT_ID
                }
            });
        };
        // Get the product details for everything in the basket.
        basket.map(getProductDetails);
        return returnString;
    }

    /** Add HTML markup for product view. */
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

    /** Create a select dropdown with the appropriate amount of quantity options. */
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

    /** Markup the products array into a list of products. */
    function styleProducts (productsArray) {
        var formattedProducts = '<ul id="products">';
        for (var i = productsArray.length - 1; i >= 0; i--) {
            var product = productsArray[i];
            formattedProducts += '<li id="product' + product.PRODUCT_ID + '"><a href="' + product.PRODUCT_URL + '"' +
                            '><h4 class="productName">' +
                            product.PRODUCT_NAME + '</h4>' +
                            '<img src="' + product.PRODUCT_IMAGE + '" alt="' +
                            product.PRODUCT_NAME + '"><p class="description">' +
                            product.PRODUCT_DESCRIPTION.substring(0,110) + '...</p>' +
                            '<p class="cost">&pound;' + Number(product.PRODUCT_PRICE).toFixed(2).toLocaleString() + '</a></p></li>';
            }
        return formattedProducts;
    }

    /** Markup the categories as a list for display as menu items. */
    function styleCategories (categoriesArray) {
        var formattedCategories = '<li class="category" id="-1">Show All</li>';
        for (var i = 0; i < categoriesArray.length; i++) {
            var category = categoriesArray[i];
            formattedCategories += '<li class="category" id="' + category.CATEGORY_ID +
                                    '">'+ category.CATEGORY_NAME + '</li>';
        }
        return formattedCategories;
    }

    /** Shown on successful order. */
    function styleOrderSuccess () {
        s.dynamicArea.innerHTML = '<h3>Order Successful!</h3><p>Thank you for your order. We\'ll do our best to get it to you as soon as possible.</p>' +
        '<p>We\'ll contact you via email should there be any changes or queries regarding your order, so keep an eye on that inbox!</p>';
    }

    /** Functions accessible for other scripts. */
    return {
        pageLoaded: pageLoaded,
        showProduct: showProduct,
        manageBasket: manageBasket,
        showFeedback: showFeedback
    };
}();
// Brackets following function call it straight away. Then attach listener to load.
window.addEventListener('load', onShop.functions.pageLoaded);
