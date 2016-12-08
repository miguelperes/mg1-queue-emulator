function Process(type, processTime)
{
	this.type = type;
	this.processTime = processTime;
}

function FCFS(lambda1, lambda2, mi1, mi2)
{
	this.arrivalRate1 = lambda1;
	this.arrivalRate2 = lambda2;
	this.processTime1 = mi1;
	this.processTime2 = mi2;

	this.rate = this.arrivalRate1 + this.arrivalRate2;

	this.waitQueue  = [];
	this.server = [];

	this.average = 0;
	this.arrivalTimeSum = 0;
	this.numberOfArrivalsSinceStart = 0;

	this.shouldGetNextArrival = false;
	
	this.Start = function()
	{
		console.log( this.nextArrival() );
		setTimeout((function(){this.processNextArrival(this)}).bind(this), this.nextArrival*1000);
	}

	this.nextArrival = function()
	{
			return PoissonGenerator.nextArrival(this.rate);
	}

	this.processNextArrival = function(ref)
	{
		var timeToNext = ref.nextArrival();
		console.log("cetta "+timeToNext);
		ref.numberOfArrivalsSinceStart += 1;
		ref.arrivalTimeSum += timeToNext;
		ref.average = ref.arrivalTimeSum/ref.numberOfArrivalsSinceStart;
		console.log("Res: " + ref.numberOfArrivalsSinceStart + "   " + ref.average);
		setTimeout((function(){ref.processNextArrival(ref)}).bind(ref), timeToNext);
	}
}

var main = function()
{
	var queue = new FCFS(1/40, 1/60, 1/20, 1/30);
	queue.Start();
}

main();