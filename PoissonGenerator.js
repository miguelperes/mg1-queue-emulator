function PoissonGenerator() {}

PoissonGenerator.get = function(rate) {
		//return in seconds
		return -Math.log(1.0 - Math.random()) / rate;
}

