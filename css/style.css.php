<?php 
	header("Content-type: text/css"); 
	require_once($_SERVER["DOCUMENT_ROOT"] . "/663652/OnShop/inc/config.php");
?>


@import url("normalize.css");
@import url(http://fonts.googleapis.com/css?family=Lato);

html {overflow-y: scroll; overflow-x: hidden;}
body {font-family: 'Lato', sans-serif; background:#f0eeed; color: #676767;}

.container {
	width: 98%;
	margin: 0 auto;
}

.header {
	background: #5287E3;
	border-bottom: 0.3em solid #2558B0;
}

.header:after,
.container:after {
	content:"";
	display:block;
	clear:both;
}

.header .branding-title {
	float: left;
	display: block;
}

.header .branding-title a {
	color: black;
	text-decoration: none;
}

.header .nav li a {
    color: white;
    display: block;
    text-align: right;
    text-transform: uppercase;
    line-height: 5em; 
    text-decoration: none;
    padding-left: 2em;
}

.header .nav li.on a {
	text-decoration: underline;
}

.header .nav {
	float: right;
	top: 0; 
	right: 0; 
	margin: 0; 
	position: relative; 
	z-index: 99;
}

.header .nav li {
	display: inline-block; 
	margin: 0; 
	list-style: none;
}

.header .searchbar {
	line-height: 5em;
	float: right;
	display: inline-block;

}
.header .searchbar input {
	width: 20em;
}

#content {
	background: white;
	min-height: 40em;
}

.footer {
    background: #f0eeed;
    padding: 2em 0;
    font-size: 12px;
    color: #a5a5a5;
    font-family: Helvetica, Arial, sans-serif;
}

.footer ul {
	float: left; margin: 0;
}

.footer ul li {
    list-style: none;
    display: inline-block;
    text-transform: lowercase;
    padding-right: 2em;
}

.footer p {
	margin: 0; 
	text-align: right; 
	padding-right: 0.2em; 
	display: inline-block; 
	float: right;
}

.footer a {
	text-decoration: none; 
	color: #539def; 
	margin: 0 0.2em;
}

#sideoptions {
	display: block;
	float: left;
	max-width: 15%;
	padding: 0;
	margin: 0;
	padding-top: 2em;
}

#sideoptions ul {
	float: left;
	padding-left: 0;

}

#sideoptions li {
	list-style: none;
	margin: 0 auto;
    border: 0.1em solid #e3e1e0;
	padding: 1em;
	margin: 0.8em;
	background: #f0eeed;
}

#sideoptions a {
	text-decoration: none;
}

#dynamic-content {
	float: left;
	display: inline-block;
	width: 84%;
	padding: 0;
	margin: 0;
}

#feature-title {
	text-align: center;
}

.pagination {
    text-align: center;
}

.pagination a,
.pagination span {
    padding: 0.2em 1em;
    border: 0.1em solid #e3e1e0;
    display: inline-block;    
    text-decoration: none;
    color: #676767;
}

.pagination span {
	background: #CCC; 
	border-color: #999; 
	color: #444;
}

.pagination a:hover {
	background: #f0eeed;
}

#products {
	display: block;
}

#products a {
	text-decoration: none;
	display: block;
	width: 100%;
	height: 100%;
}

#products .productName {
	text-decoration: underline;
	margin: 0.4em;
}

#products li {
    display: inline-block;
    list-style: none;
    border: 0.1em solid #e3e1e0;
    border-radius: 0.1em;
    width: 10em;
    text-align: center;
    background: #f0eeed;
    margin: 0 0 0.6em 0.6em;
    height: 20em;
    overflow: hidden;
    position: relative;
}

#products :hover {
	box-shadow: 0em 0em 0.2em grey;
}

#products li :hover {
	box-shadow: none;
}

#products li img {
    width: 10em;
    padding: 0.2em;
}

#products .description {
	color: grey;
	font-size: 90%;
}

#products p {
	padding: 0em;
	margin-top: 0em;
}

#products .cost {
	color: grey;
	size: 2em;
	position: absolute;
	bottom: 0;
	padding: 0.2em;
	margin: 0;
	vertical-align: center;
}

#product {
}

#product img {
	max-width: 30em;
	max-height: 30em;
	display: block;
	float: left;
	margin: 2.5;
	padding: 1px;
    border: 1px solid #e3e1e0;
    border-radius: 0.1em;
}

#product #product-details {
	display: block;
	float: left;
	position: relative;
	max-width: 60%;
	margin: 1.5em;
	padding: 1em;
	border: 0.1em solid #e3e1e0;
    border-radius: 0.1em;
    background: #f0eeed;
}

.loading {
	margin: 0 auto;
	display: block;
	background-image:url('<?php echo BASE_URL; ?>img/assets/ajax-loader.gif');
	width: 4em;
}

@media (min-width: 1200px) {
	.container {
		width: 80%;
	}

	#products li {
		width: 14em;
	}
}
@media (max-width: 500px) {
	#sideoptions {
		width: 100%;
		max-width: 100%;
		display: block;
	}
	#sideoptions ul {
		width: 90%;
		margin: 0 auto;
		padding: 0;
	}

	#sideoptions ul li {
		padding: 0.4em;
		margin: 0.4em auto;
	}
}
}
