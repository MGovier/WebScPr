<?php
require_once("../inc/config.php");
?>
	<form class="adminForm" name="addProductForm" action="<?php echo BASE_URL; ?>api/1/product/">
    			<fieldset>
    				<p>
		    			<label for="productName">Product Name:</label>
		    			<input type="text" id="productName" name="productName" placeholder="Enter product name" required />
	    			</p>
	    			<p>
		    			<label for="productCategory">Product Category:</label>
		    			<select id="productCategory" name="productCategory" required />
		    				<?php
								include(ROOT_PATH . "inc/db/database.php");
								$categories = $db->query("SELECT * FROM CATEGORIES");
								while ($row = $categories->fetch_assoc()) {
								    echo '<option>' . $row["CATEGORY_NAME"] . '</option>';
								}
							?>
		    			</select>
	    			</p>
	    			<p>
		    			<label for="productImage">Product Image:</label>
		    			<input type="file" id="productImage" name="productImage" />
	    			</p>
	    			<p>
		    			<label for="productDescription">Product Description:</label>
		    			<textarea id="productDescription" name="productDescription" placeholder="Enter product description"></textarea>
	    			</p>
	    			<p>
		    			<label for="productStock">Enter initial stock:</label>
		    			<input type="number" min="0" id="productStock" name="productStock" placeholder="Enter product stock - eg 10" pattern="\d+" required />
	    			</p>
	    			<p>
		    			<label for="productPrice">Enter price:</label>
		    			<input type="number" min="0" id="productPrice" name="productPrice" placeholder="Enter product price - eg 12.95" pattern="\d+|\d+\.\d{2}" required />
	    			</p>
	    			<p>
	    				<label for="submit">Submit item:</label>
	    				<input type="submit" id="submit" name="submit" value="Submit!" />
    				</p>
    			</fieldset>
			</form>