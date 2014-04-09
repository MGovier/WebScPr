<?php 

require_once("../inc/config.php");

$pageTitle = "Admin";
$section = "adminhome"; ?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8"/>	
	<title>OnShop Documentation</title>
	<link rel="stylesheet" href="<?php echo BASE_URL; ?>css/style.css" type="text/css">
	<!-- Icons -->
	<link rel="apple-touch-icon" href="<?php echo BASE_URL; ?>img/assets/apple-icon-touch.png">
	<link rel="icon" href="<?php echo BASE_URL; ?>img/assets/favicon.png">
</head>
<body>
<section class="header">
	<div class="container">
		<h1 class="branding-title"><a href="<?php echo BASE_URL; ?>"><?php echo STORE_NAME ?> > Documentation</a></h1>
	</div>
</section>

<section id="content">
<section class="container">
	<section id="feedback" class="vanish"></section>

	<h3 id="feature-title">Documents</h3>
	<section id="dynamic-content">
		<p class="file"><a href="pdf/OnShopInstallationGuide.pdf">Installation Guide PDF</a></p>
		<p class="file"><a href="pdf/OnShopUserGuide.pdf">User Guide PDF</a></p>
		<hr>
		<p class="file"><a href="pdf/OnShopFinalSpec.pdf">Final Specification</a></p>
		<hr>
		<p class="file"><a href="pdf/OnShopInterimOne.pdf">Interim One PDF</a></p>
		<p class="file"><a href="pdf/OnShopInterimTwo.pdf">Interim Two PDF</a></p>
		<p class="file"><a href="pdf/OnShopFinalReport.pdf">Final Report PDF</a></p>
    </section>
</section>

<?php include(ROOT_PATH . 'inc/footer.php'); ?>