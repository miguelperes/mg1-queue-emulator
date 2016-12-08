var chegadas = function(residualArrival, residualService) {
	var nextArrival = 0;
	var nextService = 0;

	if( residualArrival == 0 ) {
		nextArrival = -Math.log(1.0 - Math.random()) / rate;
	}
}