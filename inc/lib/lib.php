<?php

function retrieve_single_row($query) {
		$query->execute();
		$result = $query->get_result();
		if (mysqli_num_rows($result) === 1) {
			$resultRow = $result->fetch_assoc();
			return ($resultRow);
		} else return false;
	}

