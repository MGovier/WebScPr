var OnShop = OnShop || {};

OnShop.admin = function () {
    'use strict';
    
    function getAllProductsAdmin () {
        var target = document.getElementById('dynamic-content');
        target.classList.add('loading');
        var callback = function (r) {
            var products = JSON.parse(r.target.responseText);
            target.innerHTML = styleProductsAdmin(products);
            target.classList.remove('loading');
            var deleteButtons = document.querySelectorAll('#stockTable .deleteItem');
            for (var i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].addEventListener('click', deleteItem);
            }
        };
        OnShop.XHR.load(
            {
                'url': '../api/1/products/stockAsc',
                'callbacks': {
                    'load': callback,
                    'error': OnShop.functions.xhrError
                }
            }
        );
    }

    function deleteItem (e) {
        var deleteID = e.target.id;
        var check = window.confirm('Are you sure you want to delete item ' + deleteID + '?');
        if (check === true) {
            var callback = function (r) {
                OnShop.functions.showFeedback(r.target.responseText, 'notice');
                getAllProductsAdmin();
                };
            OnShop.XHR.load({
                'method': 'DELETE',
                'url': '../api/1/product/' + deleteID,
                'callbacks': {
                    'load': callback,
                    'error': OnShop.functions.xhrError
                }
            });
        }
    }

    function styleProductsAdmin (productsArray) {
        var returnString = '<table class="productTable" id="stockTable"><caption>Products Sorted By Stock</caption><thead><tr><th>Product ID</th><th>Product Thumbnail</th><th>Product Name</th><th>Product Price</th><th>Product Stock</th><th>Product Sales (NYI)</th><th class="update">Update</th></tr></thead>';
        for (var i = 0; i < productsArray.length; i++) {
            var product = productsArray[i];
            returnString += '<tr><td>' + product.PRODUCT_ID + '</td>' +
                            '<td class="thumbnail"><img src="' + product.PRODUCT_IMAGE + '"></td>' +
                            '<td>' + product.PRODUCT_NAME  + '</td>' +
                            '<td>' + product.PRODUCT_PRICE + '</td>' +
                            '<td>' + product.PRODUCT_STOCK + '</td>' +
                            '<td>' + 0 + '</td>' +
                            '<td><button class="editItem" id="' + product.PRODUCT_ID + '">Edit</button>' +
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
                sendForm(this.form);
                e.preventDefault();
            });
        };
        OnShop.XHR.load(
            {
                'url': 'addProductForm.php',
                'callbacks': {
                    'load': callback,
                    'error': OnShop.functions.xhrError
                }
            }
        );
    }

    function showAddCategoryForm () {
        var callback = function (r) {
            document.getElementById('dynamic-content').innerHTML = r.target.responseText;
            document.getElementById('submit').addEventListener('click', function (e) {
                sendForm(this.form);
                e.preventDefault();
            });
        };
        OnShop.XHR.load(
            {
                'url': 'addCategoryForm.php',
                'callbacks': {
                    'load': callback,
                    'error': OnShop.functions.xhrError
                }
            }
        );
    }

    var sendForm = function (form) {
        var formData = new FormData(form);
        formData.append('adminToken', '845689458465189121856489418946548479');
        var callback = function (r) {
            OnShop.functions.showFeedback(r.target.responseText, 'notice');
        };
        OnShop.XHR.load(
            {
                'method': 'POST',
                'url': form.action,
                'data': formData,
                'callbacks': {
                    'load': callback,
                    'error': OnShop.functions.xhrError
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
        OnShop.XHR.load(
            {
                'url': '../api/1/categories/products',
                'callbacks': {
                    'load': callback,
                    'error': OnShop.functions.xhrError
                }
            }
        );
    }

    function deleteCategory (e) {
        var deleteID = e.target.id;
        var check = window.confirm('Are you sure you want to delete category ' + deleteID + '?');
        if (check === true) {
            var callback = function (r) {
                OnShop.functions.showFeedback(r.target.responseText, 'notice');
                manageCategories();
                };
            OnShop.XHR.load({
                'method': 'DELETE',
                'url': '../api/1/category/' + deleteID,
                'callbacks': {
                    'load': callback,
                    'error': OnShop.functions.xhrError
                }
            });
        }
    }

    return {
        loaded: loaded
    };

}();
window.addEventListener('load', OnShop.admin.loaded);
