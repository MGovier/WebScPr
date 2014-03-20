var onShop = onShop || {};

onShop.admin = function () {
    'use strict';
    
    function getAllProductsAdmin () {
        var target = document.getElementById('dynamic-content');
        target.classList.add('loading');
        var callback = function (r) {
            var products = JSON.parse(r.target.responseText);
            target.innerHTML = styleProductsAdmin(products);
            target.classList.remove('loading');
            refreshFormListeners();
        };
        onShop.XHR.load(
            {
                'url': '../api/1/products/stockAsc',
                'callbacks': {
                    'load': callback,
                    'error': onShop.functions.xhrError
                }
            }
        );
    }

    function refreshFormListeners () {
        var deleteButtons = document.querySelectorAll('#stockTable .deleteItem');
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', deleteItem);
        }
        var editButtons = document.querySelectorAll('#stockTable .editItem');
        for (var k = 0; k < editButtons.length; k++) {
            editButtons[k].addEventListener('click', editItem);
        }
    }

    function deleteItem (e) {
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

    function editItem (e) {
        var updateID = e.target.id;
        var stockBox = document.querySelector('#product' + updateID + ' .stock');
        stockBox.innerHTML = '<input type="number" id="newStock" min="0" value="' + stockBox.innerHTML + '">';
        var priceBox = document.querySelector('#product' + updateID + ' .price');
        priceBox.innerHTML = '<input type="number" id="newPrice" min="0" value="' + priceBox.innerHTML + '">';
        var optionsBox = document.querySelector('#product' + updateID + ' .optionButtons');
        optionsBox.innerHTML = '<button id="doneEditing">Done</button>';
        var submit = function () {
            var stock = stockBox.firstChild.value;
            var price = priceBox.firstChild.value;
            var callback = function (r) {
                onShop.functions.showFeedback(r.target.responseText, 'notice');
                priceBox.innerHTML = price;
                stockBox.innerHTML = stock;
                optionsBox.innerHTML = '<td class="optionButtons"><button class="editItem" id="' + updateID + '">Edit</button>' +'<button class="deleteItem" id="' + updateID + '">Remove</button></td>';
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
        };
        var doneButton = document.querySelector('#product' + updateID + ' #doneEditing');
        doneButton.addEventListener('click', submit);
    }

    function styleProductsAdmin (productsArray) {
        var returnString = '<table class="productTable" id="stockTable"><caption>Products Sorted By Stock</caption><thead><tr><th>Product ID</th><th>Product Thumbnail</th><th>Product Name</th><th>Product Price</th><th>Product Stock</th><th>Product Sales (NYI)</th><th class="update">Update</th></tr></thead>';
        for (var i = 0; i < productsArray.length; i++) {
            var product = productsArray[i];
            returnString += '<tr id="product' + product.PRODUCT_ID + '"><td>' + product.PRODUCT_ID + '</td>' +
                            '<td class="thumbnail"><img src="' + product.PRODUCT_IMAGE + '"></td>' +
                            '<td>' + product.PRODUCT_NAME  + '</td>' +
                            '<td class="price">' + product.PRODUCT_PRICE + '</td>' +
                            '<td class="stock">' + product.PRODUCT_STOCK + '</td>' +
                            '<td>' + 0 + '</td>' +
                            '<td class="optionButtons"><button class="editItem" id="' + product.PRODUCT_ID + '">Edit</button>' +
                            '<button class="deleteItem" id="' + product.PRODUCT_ID + '">Remove</button></td>';
        }
        return returnString + '</table>';
    }

    function loaded () {
        getAllProductsAdmin();
        var stockToggle = document.getElementById('stockLevels');
        var toggleStockTable = function () {
            getAllProductsAdmin();
        };
        stockToggle.addEventListener('click', toggleStockTable);
        var showAddFormButton = document.getElementById('productAddFormToggle');
        showAddFormButton.addEventListener('click', showAddForm);
        var showAddCategoryFormButton = document.getElementById('addCategoryToggle');
        document.getElementById('manageCategories').addEventListener('click', manageCategories);
        showAddCategoryFormButton.addEventListener('click', showAddCategoryForm);
    }

    function showAddForm () {
        var callback = function (r) {
            document.getElementById('dynamic-content').innerHTML = r.target.responseText;
            document.getElementById('submit').addEventListener('click', function (e) {
                if (this.form.checkValidity()) {
                    e.preventDefault()
                    sendForm(this.form);
                }
            });
        };
        onShop.XHR.load(
            {
                'url': 'addProductForm.php',
                'callbacks': {
                    'load': callback,
                    'error': onShop.functions.xhrError
                }
            }
        );
    }

    function showAddCategoryForm () {
        var callback = function (r) {
            document.getElementById('dynamic-content').innerHTML = r.target.responseText;
            document.getElementById('submitCat').addEventListener('click', function (e) {
                if (this.form.checkValidity()) {
                    e.preventDefault()
                    sendForm(this.form);
                }
            });
        };
        onShop.XHR.load(
            {
                'url': 'addCategoryForm.php',
                'callbacks': {
                    'load': callback,
                    'error': onShop.functions.xhrError
                }
            }
        );
    }

    var sendForm = function (form) {
        var formData = new FormData(form);
        var callback = function (r) {
            onShop.functions.showFeedback(r.target.responseText, 'notice');
        };
        onShop.XHR.load(
            {
                'method': 'POST',
                'url': form.action,
                'data': formData,
                'callbacks': {
                    'load': callback,
                    'error': onShop.functions.xhrError
                }
            }
        );
    };

    function manageCategories () {
        var tableHTML = '<table class="productTable" id="categoriesTable"><caption>Categories (please note, only empty categories may be removed)</caption><thead><tr><th>Category ID</th><th>Category Name</th><th>Items in Category</th><th>Update</th></tr></thead>';
        var callback = function (r) {
            var categories = JSON.parse(r.target.responseText);
            for (var i = 0; i < categories.length; i++) {
                var cat = categories[i];
                tableHTML += '<tr><td>' + cat.CATEGORY_ID + '</td><td>' + cat.CATEGORY_NAME + '</td><td>' + cat.COUNT + '</td>';
                if (parseInt(cat.COUNT) === 0) {tableHTML += '<td><button class="deleteCat" id="' + cat.CATEGORY_ID + '">Remove</button></td></tr>';}
                else {tableHTML += '<td><button disabled>Remove</button></td></tr>';}
            }
            document.getElementById('dynamic-content').innerHTML = tableHTML;
            var deleteButtons = document.querySelectorAll('#categoriesTable .deleteCat');
                for (var j = 0; j < deleteButtons.length; j++) {
                    deleteButtons[j].addEventListener('click', deleteCategory);
                }
        };
        onShop.XHR.load(
            {
                'url': '../api/1/categories/products',
                'callbacks': {
                    'load': callback,
                    'error': onShop.functions.xhrError
                }
            }
        );
    }

    function deleteCategory (e) {
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

    return {
        loaded: loaded
    };

}();
window.addEventListener('load', onShop.admin.loaded);
