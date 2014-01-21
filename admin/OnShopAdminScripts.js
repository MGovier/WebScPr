var OnShopAdmin = OnShopAdmin || {};

OnShopAdmin.functions = (function () {
    'use strict';
    var getAllProductsAdmin = function () {
    var target = document.getElementById('dynamic-content');
    target.classList.add('loading');
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status === 200 || this.status === 301) {
            var productsArray = JSON.parse(this.responseText);
            target.innerHTML = styleProductsAdmin(productsArray);
            target.classList.remove('loading');
        } else {
            target.innerHTML = '<p>Something went wrong.</p>';
        }
    };
    xhr.open('GET', '../API/GET/products.php?sort=stockAsc', true);
    xhr.send();
    };

    var styleProductsAdmin = function(productsArray) {
        var returnString = '<table id=productsTable><caption>Products Sorted By Stock</caption><thead><tr><th>Product ID</th><th>Product Thumbnail</th><th>Product Name</th><th>Product Price</th><th>Product Stock</th><th>Product Sales (NYI)</th><th>Update</th></tr></thead>';
        for (var i = 0; i < productsArray.length; i++) {
            var product = productsArray[i];
            returnString += '<tr><td>' + product.PRODUCT_ID + '</td>' +
                            '<td id="thumbnail"><img src="' + product.PRODUCT_IMAGE + '"></td>' +
                            '<td>' + product.PRODUCT_NAME  + '</td>' +
                            '<td>' + product.PRODUCT_PRICE + '</td>' +
                            '<td>' + product.PRODUCT_STOCK + '</td>' +
                            '<td>' + 0 + '</td>' +
                            '<td><button id="editItem">Edit</button></td>';
        }
        return returnString + '</table>';
    };

    var loaded = function () {
        var stockToggle = document.getElementById('stockLevels');
        var toggleStockTable = function () {
            getAllProductsAdmin();
            document.getElementById('addProductForm').classList.add('hidden');
        };
        stockToggle.addEventListener('click', toggleStockTable);
        var addFormToggle = document.getElementById('productAddFormToggle');
        var toggleAddForm = function () {
            var addForm = document.getElementById('addProductForm');
            document.getElementById('dynamic-content').innerHTML = '';
            addForm.classList.remove('hidden');
        };
        addFormToggle.addEventListener('click', toggleAddForm);
    };

    var sendForm = function (form) {
        var formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        var feedbackTarget = document.getElementById('dynamic-content');
        xhr.open('POST', form.action, true);
        xhr.onload = function () {
            if (this.status === 200 || this.status === 301) {
                feedbackTarget.innerHTML = this.responseText;
            } else {
                feedbackTarget.innerHTML = '<p>Something went wrong.</p>';
            }
        };
        xhr.send(formData);
        return false; // Stop page from submitting.
    };

    return {
        getAllProductsAdmin: getAllProductsAdmin,
        loaded: loaded,
        sendForm: sendForm
    };

}());
window.addEventListener('load', OnShopAdmin.functions.loaded);
