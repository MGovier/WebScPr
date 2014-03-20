<?php
require_once("../inc/config.php");
?>
	<form class="adminForm" name="addCategoryForm" action="<?php echo BASE_URL; ?>api/1/category/" >
    			<fieldset>
    				<p>
		    			<label for="categoryName">Category Name:</label>
		    			<input type="text" id="categoryName" name="categoryName" placeholder="Enter category name" required>
	    			</p>
	    			<p>
	    				<label for="submitCat">Submit Category:</label>
	    				<input type="submit" id="submitCat" name="submitCat" value="Submit!">
    				</p>
    			</fieldset>
			</form>