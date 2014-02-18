var OnShopAdmin = OnShopAdmin || {};

OnShopAdmin.functions = function () {
    'use strict';
    function getAllProductsAdmin () {
        var target = document.getElementById('dynamic-content');
        target.classList.add('loading');
        var callback = function (productsArray) {
            var products = JSON.parse(productsArray);
            target.innerHTML = styleProductsAdmin(products);
            target.classList.remove('loading');
            var deleteButtons = document.querySelectorAll('#productsTable .deleteItem');
            for (var i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].addEventListener('click', deleteItem);
            }
        };
        OnShop.functions.xhrClient('GET', '../api/1/products/stockAsc', callback);
    }

    function deleteItem (e) {
        var deleteID = e.target.id;
        var check = window.confirm('Are you sure you want to delete item ' + deleteID + '?');
        if (check === true) {
            var callback = function (response) {
                document.getElementById('dynamic-content').innerHTML = response;
                };
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.status == '200' || this.status == '304') {
                    callback(this.response);
                } else {
                    callback(this.status);
                }
            };
            xhr.open('DELETE','../api/1/product/' + deleteID, true);
            xhr.send();
        }
    }

    function styleProductsAdmin (productsArray) {
        var returnString = '<table id=productsTable><caption>Products Sorted By Stock</caption><thead><tr><th>Product ID</th><th>Product Thumbnail</th><th>Product Name</th><th>Product Price</th><th>Product Stock</th><th>Product Sales (NYI)</th><th class="update">Update</th></tr></thead>';
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
        var callback = function (response) {
            document.getElementById('dynamic-content').innerHTML = response;
            document.getElementById('submit').addEventListener('click', function (e) {
                sendForm('POST', this.form);
                e.preventDefault();
            });
        };
        OnShop.functions.xhrClient('GET', 'addProductForm.php', callback);
    }

    function showAddCategoryForm () {
        var callback = function (response) {
            document.getElementById('dynamic-content').innerHTML = response;
            document.getElementById('submit').addEventListener('click', function (e) {
                sendForm('POST', this.form);
                e.preventDefault();
            });
        };
        OnShop.functions.xhrClient('GET', 'addCategoryForm.php', callback);
    }

    var sendForm = function (method, form) {
        var formData = new FormData(form);
        formData.append('adminToken', '845689458465189121856489418946548479');
        var xhr = new XMLHttpRequest();
        var feedbackTarget = document.getElementById('dynamic-content');
        xhr.open(method, form.action, true);
        xhr.onload = function () {
            if (this.status === 200 || this.status === 301) {
                feedbackTarget.innerHTML = this.responseText;
            } else {
                feedbackTarget.innerHTML = '<p>Something went wrong.</p>';
            }
        };
        xhr.send(formData);
    };

    function manageCategories () {
        var tableHTML = '<table id=productsTable><caption>Categories</caption><thead><tr><th>Category ID</th><th>Category Name</th><th>Items in Category</th><th>Update</th></tr></thead>';
        var callback = function (catJSON) {
            var categories = JSON.parse(catJSON);
            for (var i = 0; i < categories.length; i++) {
                var cat = categories[i];
                tableHTML += '<tr><td>' + cat.CATEGORY_ID + '</td><td>' + cat.CATEGORY_NAME + '</td><td>' + cat.COUNT + '</td>' +
                            '<td><button class="editCat" id="' + cat.CATEGORY_ID + '">Edit</button>' +
                            '<button class="deleteCat" id="' + cat.CATEGORY_ID + '">Remove</button></td></tr>';
            }
            document.getElementById('dynamic-content').innerHTML = tableHTML;
        };
        OnShop.functions.xhrClient('GET', '../api/1/categories/products', callback);
    }

    return {
        getAllProductsAdmin: getAllProductsAdmin,
        loaded: loaded
    };

}();
window.addEventListener('load', OnShopAdmin.functions.loaded);
