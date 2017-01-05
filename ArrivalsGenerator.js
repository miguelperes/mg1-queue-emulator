function ArrivalsGenerator(arrivalRate, clientClass, averageClientServiceTime, callback) {
	this.arrivalRate = arrivalRate;
	this.clientClass = clientClass;
	this.averageClientServiceTime = averageClientServiceTime
	this.pause = false;

	this.callbackClass = callback;

	this.start = function()
	{
		var nextArrival = this.nextArrival();
		//console.log( `Start - ArrivalsGenerator - nextArrival: ${nextArrival}` );
		setTimeout((function(){this.processNextArrival(this)}).bind(this), nextArrival * 1000);
	}

	this.nextArrival = function() {
			return PoissonGenerator.get(this.arrivalRate);
	}

	this.processNextArrival = function(ref) {
		// console.log('PROCESS NEXT ARRIVAL');
		var timeToNext = ref.nextArrival();
		//console.log("processNextArrival - timeToNext: " + timeToNext);

		if (!this.pause) {
			var newClient = new Client(this.clientClass, PoissonGenerator.get(this.averageClientServiceTime));
			this.callbackClass.addNewClient(newClient);
			// console.log("next arrival: " + timeToNext);
			setTimeout((function(){ref.processNextArrival(ref)}).bind(ref), timeToNext * 1000);
		}
	}

}