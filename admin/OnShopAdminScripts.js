/**
    JS functions relevant only to the store admin,
    such as product updating and viewing orders.

    @author UP663652
*/

// Create a namespace for OnShop code to avoid clashes (if one doesn't exist!)
var onShop = onShop || {};

onShop.admin = function () {
    // Strict mode helps ensure code correctness.
    'use strict';

    /** 
        Called on page load, and shows the product table by default.
        Sets up event listeners for all the admin buttons.
    */
    function loaded() {
        getAllProductsAdmin();
        var toggleStockTable = function () {
            getAllProductsAdmin();
        };
        document.getElementById('stockLevels').addEventListener('click', toggleStockTable);
        document.getElementById('productAddFormToggle').addEventListener('click', showAddForm);
        document.getElementById('manageCategories').addEventListener('click', manageCategories);
        document.getElementById('addCategoryToggle').addEventListener('click', showAddCategoryForm);
        document.getElementById('viewOrders').addEventListener('click', manageOrders);
        document.getElementById('viewCompleteOrders').addEventListener('click', viewOrderHistory);
    }

    /** Load a table of all the products. */
    function getAllProductsAdmin() {
        var target = document.getElementById('dynamic-content');
        target.classList.add('loading');
        var callback = function (r) {
            var products = JSON.parse(r.target.responseText);
            target.innerHTML = styleProductsAdmin(products);
            target.classList.remove('loading');
            refreshFormListeners();
        };
        onShop.XHR.load({
            'url': '../api/1/products/stockAsc',
            'callbacks': {
                'load': callback,
                'error': onShop.functions.xhrError
            }
        });
    }

    /** Attaches event listeners to the edit and delete buttons in the products table. */
    function refreshFormListeners() {
        var deleteButtons = document.querySelectorAll('#stockTable .deleteItem');
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', deleteItem);
        }
        var editButtons = document.querySelectorAll('#stockTable .editItem');
        for (var k = 0; k < editButtons.length; k++) {
            editButtons[k].addEventListener('click', editItem);
        }
    }

    /** Deletes an item though a DELETE request to the API. */
    function deleteItem(e) {
        var deleteID = e.target.id;
        var check = window.confirm('Are you sure you want to delete item ' + deleteID + '?');
        if (check === true) {
            var callback = function (r) {
                onShop.functions.showFeedback(r.target.responseText, 'notice');
                getAllProductsAdmin();
            };
            onShop.XHR.load({
                'method': 'DELETE',
                'url': '../api/1/product/' + deleteID,
                'callbacks': {
                    'load': callback,
                    'error': onShop.functions.xhrError
                }
            });
        }
    }

    /** Adds edit boxes in the table row to specify new price and stock information.
        Submits the information through a PATCH request to the API. */
    function editItem(e) {
        var updateID = e.target.id;
        var stockBox = document.querySelector('#product' + updateID + ' .stock');
        // We can't use type="number" here, or else chrome ignores the possibility of it being a string.
        // Perhaps could use a form and then validate it, but how to split across multiple table cells?
        stockBox.innerHTML = '<input id="newStock" min="0" value="' + stockBox.innerHTML + '">';
        var priceBox = document.querySelector('#product' + updateID + ' .price');
        priceBox.innerHTML = '<input id="newPrice" min="0" value="' + priceBox.innerHTML + '">';
        var optionsBox = document.querySelector('#product' + updateID + ' .optionButtons');
        optionsBox.innerHTML = '<button id="doneEditing">Done</button>';
        var submit = function () {
            var stock = stockBox.firstChild.value;
            var price = priceBox.firstChild.value;
            // Ensure both values are numbers or tell them off.
            if (!(isNaN(stock) || isNaN(price))) {
                var callback = function (r) {
                    onShop.functions.showFeedback(r.target.responseText, 'notice');
                    priceBox.innerHTML = price;
                    stockBox.innerHTML = stock;
                    // Putting the buttons back after editing.
                    optionsBox.innerHTML = '<td class="optionButtons"><button class="editItem" id="' + updateID + '">Edit</button>' + '<button class="deleteItem" id="' + updateID + '">Remove</button></td>';
                    // Attach new event listeners to the new buttons.
                    refreshFormListeners();
                };
                onShop.XHR.load({
                    'data': {
                        'id': updateID,
                        'stock': stock,
                        'price': price
                    },
                    'method': 'PATCH',
                    'url': '../api/1/product/',
                    'callbacks': {
                        'load': callback,
                        'error': onShop.functions.xhrError
                    }
                });
            } else onShop.functions.showFeedback('Numbers only, please!', 'notice');
        };
        var doneButton = document.querySelector('#product' + updateID + ' #doneEditing');
        doneButton.addEventListener('click', submit);
    }


    /** Displays a table of open orders, with a button to mark them as completed. */
    function manageOrders() {
        var callback = function (r) {
            document.getElementById('dynamic-content').innerHTML = styleOrders(r.target.responseText, true);
            // Attach event listeners to however many buttons there might be.
            var finishButtons = document.querySelectorAll('#ordersTable .order-done');
            for (var i = 0; i < finishButtons.length; i++) {
                finishButtons[i].addEventListener('click', markComplete);
            }
        };
        onShop.XHR.load({
            'method': 'GET',
            'url': '../api/1/order/',
            'callbacks': {
                'load': callback,
                'error': onShop.functions.xhrError
            }
        });
    }

    /** Displays a table of finished orders. */
    function viewOrderHistory() {
        var callback = function (r) {
            document.getElementById('dynamic-content').innerHTML = styleOrders(r.target.responseText, false);
            // Attach event listeners to however many buttons there might be.
            var finishButtons = document.querySelectorAll('#ordersTable .order-done');
            for (var i = 0; i < finishButtons.length; i++) {
                finishButtons[i].addEventListener('click', markComplete);
            }
        };
        onShop.XHR.load({
            'method': 'GET',
            'url': '../api/1/order/4',
            'callbacks': {
                'load': callback,
                'error': onShop.functions.xhrError
            }
        });
    }

    /** Updates the database through a PATCH request to mark the order as completed. */
    function markComplete(e) {
        var callback = function (r) {
            onShop.functions.showFeedback(r.target.response, 'notice');
            // Reload the table.
            manageOrders();
        };
        onShop.XHR.load({
            'method': 'PATCH',
            'url': '../api/1/order/' + e.target.id,
            'callbacks': {
                'load': callback,
                'error': onShop.functions.xhrError
            }
        });
    }

    /** Loads the add product form. Activates a progress bar for uploading images. */
    function showAddForm() {
        var progressBar, callback = function (r) {
            var loadCallback = function (r) {
                onShop.functions.showFeedback(r.target.responseText, 'notice');
                // Resets the form and hides the progress bar when completed.
                document.getElementById('addProductForm').reset();
                progressBar.value = 0;
                progressBar.classList.add('vanish');
            };
            var progressListener = function (e) {
                if (e.lengthComputable) {
                    // Calculate the percentage completion and set it as the progress bar's value.
                    var percent = Math.round(e.loaded * 100 / e.total);
                    progressBar.value = percent;
                }
            };
            var sendListener = function (e) {
                // Check the form is valid before we send it.
                if (e.target.checkValidity()) {
                    progressBar = document.getElementById('upload-progress');
                    // Prevent default action of redirect to the form action.
                    e.preventDefault();
                    var formData = new FormData(e.target);
                    onShop.XHR.load({
                        'method': 'POST',
                        'url': e.target.action,
                        'data': formData,
                        'callbacks': {
                            'load': loadCallback,
                            'progress': progressListener,
                            'error': onShop.functions.xhrError
                        }
                    });
                    progressBar.classList.remove('vanish');
                }
            };
            document.getElementById('dynamic-content').innerHTML = r.target.responseText;
            document.getElementById('addProductForm').addEventListener('submit', sendListener);
        };
        onShop.XHR.load({
            'url': 'addProductForm.php',
            'callbacks': {
                'load': callback,
                'error': onShop.functions.xhrError
            }
        });
    }

    /** Load the add category form and attach listeners for sending. */
    function showAddCategoryForm() {
        var callback = function (r) {
            var loadCallback = function (r) {
                onShop.functions.showFeedback(r.target.responseText, 'notice');
                document.getElementById('categoryName').value = '';
            };
            var sendListener = function (e) {
                // Checking the form is valid.
                if (e.target.checkValidity()) {
                    e.preventDefault();
                    sendForm(e.target, loadCallback);
                }
            };
            document.getElementById('dynamic-content').innerHTML = r.target.responseText;
            document.getElementById('addCategoryForm').addEventListener('submit', sendListener);
        };
        onShop.XHR.load({
            'url': 'addCategoryForm.php',
            'callbacks': {
                'load': callback,
                'error': onShop.functions.xhrError
            }
        });
    }

    /** Convert the form to a FormData object and send it to the form action location. */
    var sendForm = function (form, callback, progress) {
        var formData = new FormData(form);
        onShop.XHR.load({
            'method': 'POST',
            'url': form.action,
            'data': formData,
            'callbacks': {
                'load': callback,
                'progress': progress,
                'error': onShop.functions.xhrError
            }
        });
    };

    /** Show a table of all categories from the API. Includes removal buttons (inactive for unempty categories) */
    function manageCategories() {
        var tableHTML = '<table class="productTable" id="categoriesTable"><caption>Categories (only empty categories may be removed)</caption><thead><tr><th>Category ID</th><th>Category Name</th><th>Items in Category</th><th>Update</th></tr></thead>';
        var callback = function (r) {
            var categories = JSON.parse(r.target.responseText);
            for (var i = 0; i < categories.length; i++) {
                var cat = categories[i];
                tableHTML += '<tr><td>' + cat.CATEGORY_ID + '</td><td>' + cat.CATEGORY_NAME + '</td><td>' + cat.COUNT + '</td>';
                if (parseInt(cat.COUNT) === 0) {
                    tableHTML += '<td><button class="deleteCat" id="' + cat.CATEGORY_ID + '">Remove</button></td></tr>';
                } else {
                    // Disabled button to show the action would be available if the category was empty.
                    tableHTML += '<td><button disabled>Remove</button></td></tr>';
                }
            }
            document.getElementById('dynamic-content').innerHTML = tableHTML;
            // Attach event listeners to all the buttons.
            var deleteButtons = document.querySelectorAll('#categoriesTable .deleteCat');
            for (var j = 0; j < deleteButtons.length; j++) {
                deleteButtons[j].addEventListener('click', deleteCategory);
            }
        };
        onShop.XHR.load({
            'url': '../api/1/categories/products',
            'callbacks': {
                'load': callback,
                'error': onShop.functions.xhrError
            }
        });
    }

    /** Verify the user wants to delete this category, then send a DELETE request to the API. */
    function deleteCategory(e) {
        var deleteID = e.target.id;
        var check = window.confirm('Are you sure you want to delete category ' + deleteID + '?');
        if (check === true) {
            var callback = function (r) {
                onShop.functions.showFeedback(r.target.responseText, 'notice');
                manageCategories();
            };
            onShop.XHR.load({
                'method': 'DELETE',
                'url': '../api/1/category/' + deleteID,
                'callbacks': {
                    'load': callback,
                    'error': onShop.functions.xhrError
                }
            });
        }
    }

    /******************************* 
     Pure HTML Generation Functions
    ********************************/

    /** Formats the products table, sorts by lowest stock first. */
    function styleProductsAdmin(productsArray) {
        var returnString = '<table class="productTable" id="stockTable"><caption>Products Sorted By Stock</caption><thead><tr><th>Product ID</th><th>Product Thumbnail</th><th>Product Name</th><th>Product Price</th><th>Product Stock</th><th>Product Sales</th><th class="update">Update</th></tr></thead>';
        for (var i = 0; i < productsArray.length; i++) {
            var product = productsArray[i];
            returnString += '<tr id="product' + product.PRODUCT_ID + '"><td>' + product.PRODUCT_ID + '</td>' +
                '<td class="thumbnail"><img src="' + product.PRODUCT_IMAGE + '"></td>' +
                '<td>' + product.PRODUCT_NAME + '</td>' +
                '<td class="price">' + product.PRODUCT_PRICE + '</td>' +
                '<td class="stock">' + product.PRODUCT_STOCK + '</td>' +
                '<td>' + product.PRODUCT_SALES + '</td>' +
                '<td class="optionButtons"><button class="editItem" id="' + product.PRODUCT_ID + '">Edit</button>' +
                '<button class="deleteItem" id="' + product.PRODUCT_ID + '">Remove</button></td>';
        }
        return returnString + '</table>';
    }

    /** Styles the (3 levels of nested JSON!) database data into a table.

        @param interactive Boolean to specify wether processing buttons should be placed in the styled table.
    */
    function styleOrders(data, interactive) {
        var orders = JSON.parse(data);
        var rString = '<table class="productTable" id="ordersTable"><caption>Orders</caption><thead><tr><th>ID</th><th>Order Date</th><th>Name</th><th>Address</th><th>Email</th><th>Status</th></tr></thead><tbody>';
        for (var i = 0; i < orders.length; i++) {
            var status, order = orders[i];
            // Could add further order status codes in the future. Only 2 used here.
            // Paid = 1, Done = 4.
            if (order.ORDER_STATUS == 1) {
                status = 'Paid';
            } else if (order.ORDER_STATUS == 4) {
                status = 'Complete';
            }
            rString += '<tr><td>' + order.ORDER_ID + '</td><td>' + order.ORDER_DATE + '</td><td>' + order.CUSTOMER_NAME + '</td><td>' + order.CUSTOMER_ADDRESS + '</td><td>' + order.CUSTOMER_EMAIL + '</td><td>' + status + '</td></tr>';
            var pString = '<tr><td colspan="5"><pre>';
            var products = JSON.parse(order.ORDER_PRODUCTS);
            for (var j = products.length - 1; j >= 0; j--) {
                var p = JSON.parse(products[j]);
                pString += p[1] + '(ID:' + p[0] + ') x ' + p[3] + '\r\n';
            }
            if (interactive) {
                rString += pString + '</pre></td><td><button id="' + order.ORDER_ID + '" class="order-done">Processed</button></td></tr>';
            } else {
                rString += pString + '</pre></td><td>Processed</td></tr>';
            }
        }
        return rString + '</tbody></table>';
    }

    // Return methods to be accessible from other scripts.
    return {
        loaded: loaded
    };

}();
// Closing () calls function immediately. Then make load run on page load...
window.addEventListener('load', onShop.admin.loaded);