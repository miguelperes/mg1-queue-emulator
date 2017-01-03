const TypeEnum = Object.freeze( {FCFS: 0, LCFS: 1} );
const queueDiv = document.getElementById('fila');
const serverDiv = document.getElementById('server');

const avgSystemTimeDiv     = document.getElementById('avg-system-time');
const avgWaitTimeDiv       = document.getElementById('avg-wait-time');
const avgPendingServiceDiv = document.getElementById('avg-pending-service');
const avgBusyTimeDiv       = document.getElementById('avg-busy-time');
const avgClientsInQueueDiv = document.getElementById('avg-clients-queue');


function QueueSimulator() {
	this.type = TypeEnum.LCFS;
	this.isPreemptive = true;
	this.hasPriority  = false;

	this.arrivalsGeneratorA;
	this.arrivalsGeneratorB;

	this.queueA = [];
	this.queueB = [];

	this.classAServiceTime = 1/5;
	this.classBServiceTime = 1/60;

	this.classAArrivalTime = 1/6;
	this.classBArrivalTime = 1/60;

	this.totalWaitTime = 0.0;
	this.totalSystemTime = 0.0;
	this.numOfServedClients = 0;

	this.totalPendingService = 0.0;
	this.totalClientsInQueue = 0.0;
	this.totalArrivals = 0;

	this.currentClient = null;

	this.isAttending = false;
	this.lastServiceTime = 0.0;
	this.currentServiceTime = 0.0;

	this.enteredInBusyTime = false;
	this.busyTimeStartTime = 0.0;
	this.totalBusyTime = 0.0;
	this.countOfBusyTimes = 0;

	this.start = function(){
		this.arrivalsGeneratorA = new ArrivalsGenerator(this.classAArrivalTime, ClientClass.A, this.classAServiceTime, this);
		this.arrivalsGeneratorA.start();

		setInterval(this.processClient.bind(this), 1);
	}

	this.addNewClient = function(newClient){
		
		this.totalArrivals ++;

		this.totalClientsInQueue += this.queueA.length;

		this.calculatePendingService();
		
		if(!this.isAttending && this.queueA.length == 0)
		{
			this.busyTimeStartTime = Date.now() / 1000;
			this.enteredInBusyTime = true;
			this.countOfBusyTimes ++;
		}

		if(this.isPreemptive)
		{
			if(this.currentClient != null)
			{
				this.queueA.push(this.currentClient);
			}
			this.currentClient = newClient;
		}
		else
		{
			this.queueA.push(newClient);
		}

		newClient.registerArrival( Date.now()/1000 );
	}


	this.processClient = function() {
		this.updateQueueView();

		if(!this.isAttending)
		{
			if(this.queueA.length > 0)
			{
				this.currentClient = this.getNextClient();

				this.lastServiceTime = Date.now()/1000;
				this.isAttending = true;
				console.log("got client!");
			}
			else
			{
				console.log("Waiting new client...");
				if(this.enteredInBusyTime)
				{
					this.totalBusyTime += Date.now()/1000 - this.busyTimeStartTime;
					this.enteredInBusyTime = false;
				}
			}
		}
		else
		{
			var now = Date.now()/1000;
			var deltaTime = now - this.lastServiceTime;
			this.lastServiceTime = now;

			this.currentClient.residualServiceTime -= deltaTime;

			console.log("Working...");
			this.updateServerView();
			this.updateAverageWaitTimeInQueue();
			if(this.currentClient.residualServiceTime <= 0)
			{
				var clientSystemTime = Date.now()/1000 - this.currentClient.arrivalTime;
				var clientWaitTime = clientSystemTime - this.currentClient.serviceTime;
				
				this.numOfServedClients++;
				
				this.totalSystemTime += clientSystemTime;
				this.totalWaitTime += clientWaitTime;
				
				console.log(clientSystemTime + "  " + clientWaitTime + "  " + this.numOfServedClients);

				this.isAttending = false;
			}
		}
	}

	this.getNextClient = function() {
		if(this.type == TypeEnum.FCFS)
		{
			return this.queueA.splice(0, 1)[0];
		}
		else
		{
			return this.queueA.pop();
		}
	}

	this.calculatePendingService = function(){
		if(this.isAttending)
			this.totalPendingService += this.currentClient.residualServiceTime;
		
		for(var clientNum in this.queueA) {
			this.totalPendingService += this.queueA[clientNum].residualServiceTime;
		}
	}

	this.updateAverageWaitTimeInQueue = function(){
		avgSystemTimeDiv.innerHTML 		= "Tempo no Sistema   | E[T] = " + this.totalSystemTime/this.numOfServedClients;
		avgWaitTimeDiv.innerHTML 		= "Tempo na Fila      | E[W] = " + this.totalWaitTime/this.numOfServedClients;
		avgPendingServiceDiv.innerHTML 	= "Trabalho Pendente  | E[U] = " + this.totalPendingService/this.totalArrivals;
		avgClientsInQueueDiv.innerHTML 	= "Número de Clientes | E[N] = " + this.totalClientsInQueue/this.totalArrivals;
		avgBusyTimeDiv.innerHTML 		= "Período Ocupado    | E[B] = " + this.totalBusyTime/this.countOfBusyTimes;
	}

	this.updateQueueView = function(){
		queueDiv.innerHTML = '';

		for(var clientNum in this.queueA) {
			var clientDiv = document.createElement('div');
			clientDiv.innerHTML = this.queueA[clientNum].residualServiceTime;
			queueDiv.append(clientDiv);
		}
	}

	this.updateServerView = function(){		
		serverDiv.innerHTML = "" + this.currentClient.residualServiceTime;
	}
}

