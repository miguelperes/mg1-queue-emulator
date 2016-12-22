const TypeEnum = Object.freeze( {FCFS: 0, LCFS: 1} );

function QueueSimulator() {
	this.type = TypeEnum.FCFS;
	this.isPreemptive = false;
	this.hasPriority  = false;

	this.arrivalsGeneratorA;
	this.arrivalsGeneratorB;

	this.queueA = [];
	this.queueB = [];

	this.classAServiceTime = 1/60;
	this.classBServiceTime = 1/60;

	this.start = function(){
		this.arrivalsGeneratorA = new ArrivalsGenerator(1/10, ClientClass.A, this.classAServiceTime, this);
		this.arrivalsGeneratorA.start();

		setInterval(this.processClient.bind(this), 0);
	}

	this.addNewClient = function(newClient){
		//console.log("Add new client");
		//console.log(this);

		this.queueA.push(newClient);
		//console.log(this.queueA);
	}

	this.isAttending = false;
	this.lastServiceTime = 0.0;
	this.currentServiceTime = 0.0;

	this.clientDuration = 10000;

	this.processClient = function() {
		if(!this.isAttending)
		{
			console.log('Chegada de novo cliente');
			//this.getNewClient();
			this.lastServiceTime = Date.now();
			this.isAttending = true;
		}
		else
		{
			var now = Date.now();
			var deltaTime = now - this.lastServiceTime;
			this.lastServiceTime = now;
			this.clientDuration -= deltaTime;

			console.log(this.clientDuration);

			if(this.clientDuration <= 0)
			{
				console.log("Acabou de processar o cliente");
				this.clientDuration = 6000;
				this.isAttending = false;
			}
		}
	}
}

