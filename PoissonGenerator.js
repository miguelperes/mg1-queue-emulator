function PoissonGenerator() {}

PoissonGenerator.get = function(rate) {
		return -Math.log(1.0 - Math.random()) / rate;
}

