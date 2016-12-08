function PoissonGenerator() {}

PoissonGenerator.nextArrival = function(rate) {
		return -Math.log(1.0 - Math.random()) / rate;
}

