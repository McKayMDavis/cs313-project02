<?php
session_start();
if (!isset($_SESSION["logged_in"])) {
	flush();
	header("Location: login.php");
	die();
}
if (!isset($_SESSION["plot-iter"])) {
	$_SESSION["plot-iter"] = 1;
} else {
	$_SESSION["plot-iter"]+=1;
}
$pngName = "temp" . $_SESSION["plot-iter"] . ".png";
$data = $_SESSION["query-results"];
$headers = array();
$rows = array();

echo "<ul class='nav nav-tabs'>
	<li class='active'><a data-toggle='tab' href='#plot'>Table</a></li>
	<li><a data-toggle='tab' href='#data'>Visual</a></li>
</ul>

<div class='tab-content'>
	<div id='plot' class='tab-pane fade in active'>";

//display table
echo "<table class='table table-bordered' style='width:100%'><tr>";
foreach($data[0] as $colname => $datum) {
	echo "<th>" . $colname . "</th>";
	$headers[] = $colname;
}
echo "</tr>";

foreach ($data as $row) {
	echo "<tr>";
	foreach ($row as $colname => $datum) {
		echo "<td>" . $datum . "</td>";
	}
	echo "</tr>";
}
echo "</table>";

//write csv (this part works)
$csvName = '/app/web/prove_05/temp.csv';

$fp = fopen($csvName, 'w');
fputcsv($fp, $headers);
foreach ($data as $row) {
    fputcsv($fp, array_values($row));
}
fclose($fp);

echo "<a href='temp.csv'>Download CSV</a><br>";

echo "</div>
	<div id='data' class='tab-pane fade'>";

//Had to use R buildpack to get Rscript installed in the slug
exec("/app/bin/Rscript /app/web/prove_05/plots.R $pngName", $errors);
if (sizeof($errors) > 0){
	var_dump($errors);
}
echo "<img src='$pngName' alt='Plot Image' style='width:100%;'></img>";
echo "<a href='$pngName'>Download Plot Image</a><br>";

echo "</div></div>";
?>