const TypeEnum = Object.freeze( {FCFS: 0, LCFS: 1} );
const queueDiv = document.getElementById('fila');
const serverDiv = document.getElementById('server');

function QueueSimulator() {
	this.type = TypeEnum.FCFS;
	this.isPreemptive = false;
	this.hasPriority  = false;

	this.arrivalsGeneratorA;
	this.arrivalsGeneratorB;

	this.queueA = [];
	this.queueB = [];

	this.classAServiceTime = 1/120;
	this.classBServiceTime = 1/60;

	this.start = function(){
		this.arrivalsGeneratorA = new ArrivalsGenerator(1/10, ClientClass.A, this.classAServiceTime, this);
		this.arrivalsGeneratorA.start();

		setInterval(this.processClient.bind(this), 0);
	}

	this.addNewClient = function(newClient){
		this.queueA.push(newClient);
		newClient.registerArrival( Date.now() );
	}

	this.currentClient = null;

	this.isAttending = false;
	this.lastServiceTime = 0.0;
	this.currentServiceTime = 0.0;

	this.processClient = function() {
		this.updateQueueView();
		if(!this.isAttending)
		{
			if(this.queueA.length > 0)
			{
				this.currentClient = this.getNewClient();
				this.lastServiceTime = Date.now();
				this.isAttending = true;
				console.log("got client!");
			}
			else
			{
				console.log("Waiting new client...");
			}
		}
		else
		{
			var now = Date.now();
			var deltaTime = now - this.lastServiceTime;
			this.lastServiceTime = now;
			this.currentClient.serviceTime -= deltaTime / 1000;

			console.log("Working...");
			this.updateServerView();
			if(this.currentClient.serviceTime <= 0)
			{
				this.isAttending = false;
			}
		}
	}

	this.getNewClient = function() {
		return this.queueA.splice(0, 1)[0];
	}

	this.updateQueueView = function(){
		queueDiv.innerHTML = '';

		for(var clientNum in this.queueA) {
			var clientDiv = document.createElement('div');
			clientDiv.innerHTML = this.queueA[clientNum].serviceTime;
			queueDiv.append(clientDiv);
		}
	}

	this.updateServerView = function(){		
		serverDiv.innerHTML = "" + this.currentClient.serviceTime;
	}
}

