const CLIENT_CLASS = Object.freeze( {A: 1, B: 2} );

function Client(clientClass, serviceTime) {
	this.clientClass = clientClass;
	this.serviceTime = serviceTime;
	this.residualServiceTime = serviceTime;
	this.arrivalTime = 0.0;

	this.setArrivalTime = function(arrivalTime) {
		this.arrivalTime = arrivalTime;
	}
}