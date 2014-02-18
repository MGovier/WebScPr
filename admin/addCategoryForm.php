<?php
require_once("../inc/config.php");
?>
	<form class="adminForm" name="addCategoryForm" action="<?php echo BASE_URL; ?>api/1/category/" >
    			<fieldset>
    				<p>
		    			<label for="categoryName">Category Name:</label>
		    			<input type="text" id="categoryName" name="categoryName" placeholder="Enter category name">
	    			</p>
	    			<p>
	    				<label for="submit">Submit Category:</label>
	    				<input type="submit" id="submit" name="submit" value="Submit!">
    				</p>
    			</fieldset>
			</form>