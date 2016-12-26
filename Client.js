const ClientClass = Object.freeze( {A: 0, B: 1} );

function Client(clientClass, serviceTime) {
	this.class = clientClass;
	this.serviceTime = serviceTime;
	this.arrivalTime = 0.0;

	this.registerArrival = function(arrivalTime) {
		this.arrivalTime = arrivalTime;
	}
}