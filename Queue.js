const QUEUE_POLICY = Object.freeze( {FCFS: 0, LCFS: 1} );
const queueADiv = document.getElementById('fila-a');
const queueBDiv = document.getElementById('fila-b');
const serverDiv = document.getElementById('server-client');

const avgSystemTimeDiv     = document.getElementById('avg-system-time');
const avgWaitTimeDiv       = document.getElementById('avg-wait-time');
const avgPendingServiceDiv = document.getElementById('avg-pending-service');
const avgBusyTimeDiv       = document.getElementById('avg-busy-time');
const avgClientsInQueueDiv = document.getElementById('avg-clients-queue');


function QueueSimulator() {
	this.type = QUEUE_POLICY.FCFS;
	this.isPreemptive = false;
	this.hasPriority  = false;

	this.arrivalsGeneratorA;
	this.arrivalsGeneratorB;

	this.queueA = [];
	this.queueB = [];

	this.classAServiceTime = 1/5;
	this.classBServiceTime = 1/5;

	this.classAArrivalTime = 1/12;
	this.classBArrivalTime = 1/12;

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
		this.arrivalsGeneratorA = new ArrivalsGenerator(this.classAArrivalTime, CLIENT_CLASS.A, this.classAServiceTime, this);
		this.arrivalsGeneratorA.start();

		this.arrivalsGeneratorB = new ArrivalsGenerator(this.classBArrivalTime, CLIENT_CLASS.B, this.classBServiceTime, this);
		this.arrivalsGeneratorB.start();

		setInterval(this.processClient.bind(this), 1);
	}

	this.addNewClient = function(newClient){
		
		this.totalArrivals ++;

		this.totalClientsInQueue += this.queueA.length + this.queueB.length;

		this.calculatePendingService();
		this.updateAverageWaitTimeInQueue();
		
		//begining of a busy time
		if(!this.isAttending && this.queueA.length == 0 && this.queueB.length == 0)
		{
			this.busyTimeStartTime = Date.now() / 1000;
			this.enteredInBusyTime = true;
			this.countOfBusyTimes ++;
		}

		if(this.currentClient == null)
		{
			this.currentClient = newClient;
		}
		else
		{
			if(this.isPreemptive)
			{
				if(this.hasPriority && this.type == QUEUE_POLICY.FCFS)
				{
					if(this.currentClient.clientClass == CLIENT_CLASS.A)
					{
						if(newClient.clientClass == CLIENT_CLASS.A)
						{
							this.queueA.push(newClient);
						}
						if(newClient.clientClass == CLIENT_CLASS.B)
						{
							this.queueB.push(newClient);
						}
					}

					if(this.currentClient.clientClass == CLIENT_CLASS.B)
					{
						if(newClient.clientClass == CLIENT_CLASS.A)
						{
							this.queueB.splice(0, 0, this.currentClient);
							this.currentClient = newClient;
						}
						if(newClient.clientClass == CLIENT_CLASS.B)
						{
							this.queueB.push(newClient);
						}
					}
				}

				if(!this.hasPriority && this.type == QUEUE_POLICY.LCFS)
				{
					this.queueA.push(this.currentClient);
					this.currentClient = newClient;
				}
			}
			else
			{
				if(this.hasPriority)
				{
					if(newClient.clientClass == CLIENT_CLASS.A)
					{
						this.queueA.push(newClient);
					}
					if(newClient.clientClass == CLIENT_CLASS.B)
					{
						this.queueB.push(newClient);					
					}
				}
				else
				{
					this.queueA.push(newClient);
				}
			}
		}

		newClient.setArrivalTime( Date.now()/1000 );
	}


	this.processClient = function() {
		var now = Date.now()/1000;
		var deltaTime = now - this.lastServiceTime;
		this.lastServiceTime = now;

		this.updateQueueView();

		if(!this.isAttending)
		{
			if(this.currentClient != null)
			{
				this.isAttending = true;
			}
			else
			{
				console.log("Waiting new client...");
				if(this.enteredInBusyTime)
				{
					this.totalBusyTime += now - this.busyTimeStartTime;
					this.enteredInBusyTime = false;
				}
			}
		}
		else //Processing client
		{
			this.currentClient.residualServiceTime -= deltaTime;

			console.log("Working...");
			this.updateServerView();

			if(this.currentClient.residualServiceTime <= 0)
			{
				// console.log("NOW E ARRIVALTIME:   " + now + "    " + this.currentClient.arrivalTime)
				var clientSystemTime = now - this.currentClient.arrivalTime;
				var clientWaitTime = clientSystemTime - this.currentClient.serviceTime;
				
				this.numOfServedClients++;
				
				this.totalSystemTime += clientSystemTime;
				this.totalWaitTime += clientWaitTime;
				
				// console.log(clientSystemTime + "  " + clientWaitTime + "  " + this.numOfServedClients);

				if(this.queueA.length > 0 || this.queueB.length > 0)
				{
					this.currentClient = this.getNextClient();
				}
				else
				{
					this.currentClient = null;
					this.isAttending = false;
				}
			}
		}
	}

	this.getNextClient = function() {
		if(this.type == QUEUE_POLICY.FCFS)
		{
			if(this.queueA.length > 0){
				return this.queueA.splice(0, 1)[0];
			}else{
				return this.queueB.splice(0, 1)[0];
			}
		}
		if(this.type == QUEUE_POLICY.LCFS)
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

		for(var clientNum in this.queueB) {
			this.totalPendingService += this.queueB[clientNum].residualServiceTime;
		}
	}

	this.updateAverageWaitTimeInQueue = function(){
		var avgSystemTime = (this.totalSystemTime/this.numOfServedClients || 0).toFixed(3);
		avgSystemTimeDiv.innerHTML = "" + avgSystemTime;
		this.updateChart(0, avgSystemTime);

		var avgWaitTime = (this.totalWaitTime/this.numOfServedClients || 0).toFixed(3);
		avgWaitTimeDiv.innerHTML = "" + avgWaitTime;
		this.updateChart(1, avgWaitTime);

		var avgPendingService = (this.totalPendingService/this.totalArrivals || 0).toFixed(3);
		avgPendingServiceDiv.innerHTML = " " + avgPendingService;
		this.updateChart(2, avgPendingService);

		var avgClientsInQueue = (this.totalClientsInQueue/this.totalArrivals || 0).toFixed(3);
		avgClientsInQueueDiv.innerHTML = "" + avgClientsInQueue;
		this.updateChart(3, avgClientsInQueue);

		var avgBusyTime = (this.totalBusyTime/this.countOfBusyTimes || 0).toFixed(3);
		avgBusyTimeDiv.innerHTML = "" + avgBusyTime;
		this.updateChart(4, avgBusyTime);

		chart.data.labels.push("");
		chart.update();
	}

	this.updateQueueView = function(){
		queueADiv.innerHTML = '';
		queueBDiv.innerHTML = '';

		for(var clientNum in this.queueA) {
			var clientDiv = document.createElement('div');
			clientDiv.className += " chip row my-chip";

			var img = document.createElement('img');
			if(this.queueA[clientNum].clientClass == CLIENT_CLASS.A)
				img.src = "./images/number1.png";
			if(this.queueA[clientNum].clientClass == CLIENT_CLASS.B)
				img.src = "./images/number2.png";
			img.alt = "Contact Person";
			clientDiv.append(img);

			clientDiv.append((this.queueA[clientNum].residualServiceTime).toFixed(5));
			queueADiv.append(clientDiv);
		}

		for(var clientNum in this.queueB) {
			var clientDiv = document.createElement('div');
			clientDiv.className += " chip row my-chip";

			var img = document.createElement('img');
			if(this.queueB[clientNum].clientClass == CLIENT_CLASS.A)
				img.src = "./images/number1.png";
			if(this.queueB[clientNum].clientClass == CLIENT_CLASS.B)
				img.src = "./images/number2.png";
			img.alt = "Contact Person";
			clientDiv.append(img);

			clientDiv.append((this.queueB[clientNum].residualServiceTime).toFixed(5));
			queueBDiv.append(clientDiv);
		}
	}

	this.updateChart = function(datasetIndex, newData) {
		const dataLength = chart.config.data.datasets[datasetIndex].data.length;

		if(newData != "NaN"  ) {
			chart.config.data.datasets[datasetIndex].data.push(newData);
		}
		else {
			chart.config.data.datasets[datasetIndex].data.push(0);	
		}

	}

	this.updateServerView = function(){
		serverDiv.innerHTML = '';

		if(this.currentClient.residualServiceTime > 0.0){
			var img = document.createElement('img');
			if(this.currentClient.clientClass == CLIENT_CLASS.A)
				img.src = "./images/number1.png";
			if(this.currentClient.clientClass == CLIENT_CLASS.B)
				img.src = "./images/number2.png";
			img.alt = "Contact Person";
			serverDiv.append(img);

			serverDiv.append((this.currentClient.residualServiceTime).toFixed(5));
		}
		else
		{
			serverDiv.append("Empty");
		}
	}
}

