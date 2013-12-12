<?php 

require_once("inc/config.php");

$pageTitle = "Home";
$section = "home";
include(ROOT_PATH . 'inc/header.php'); ?>

<div class="container">
	<div class="categories">
		<ul>
			<li>Category 1</li>
			<li>Category 2 is a long category</li>
			<li>Cat 3</li>
		</ul>
	</div>
	<div class="wrapper">
		<h3 class="feature-title">New Products</h3>
		<div class="pagination">
			<span>1</span>
			<a href="./?pg=2">2</a>
			<a href="./?pg=3">3</a>
			<a href="./?pg=4">4</a>								
		</div>
		<ul class="products">
			<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<li>
	        <a href="#">
	        	<h4>Product Name</h4>
	            <img src="<?php echo BASE_URL; ?>img/favicon.png" alt="Product Image">
	            <p>Tell me more...</p>
	        </a>
	    	</li>
	    	<?php
	    		include(ROOT_PATH . "inc/db/database.php");
	    	?>
    </ul>
	</div>
</div>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>