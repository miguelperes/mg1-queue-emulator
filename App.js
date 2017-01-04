var queue = new QueueSimulator();

const startButton = document.querySelector('#start-button');
startButton.onclick = function() {
	queue.start();
}

const policy1 = document.querySelector('#policy1');
policy1.onclick = function() {
	queue.type = QUEUE_POLICY.FCFS;
	queue.isPreemptive = false;
	queue.hasPriority  = false;
}

const policy2 = document.querySelector('#policy2');
policy2.onclick = function() {
	queue.type = QUEUE_POLICY.LCFS;
	queue.isPreemptive = false;
	queue.hasPriority  = false;
}

const policy3 = document.querySelector('#policy3');
policy3.onclick = function() {
	queue.type = QUEUE_POLICY.LCFS;
	queue.isPreemptive = true;
	queue.hasPriority  = false;
}

const policy4 = document.querySelector('#policy4');
policy4.onclick = function() {
	queue.type = QUEUE_POLICY.FCFS;
	queue.isPreemptive = false;
	queue.hasPriority  = true;
}

const policy5 = document.querySelector('#policy5');
policy5.onclick = function() {
	queue.type = QUEUE_POLICY.FCFS;
	queue.isPreemptive = true;
	queue.hasPriority  = true;
}

const lambda1 = document.querySelector('#lambda-1');
lambda1.onchange = function() {
	queue.classAArrivalTime = eval(lambda1.value);
}

const lambda2 = document.querySelector('#lambda-2');
lambda2.onchange = function() {
	queue.classBArrivalTime = eval(lambda2.value);
}

const mu1 = document.querySelector('#mu-1');
mu1.onchange = function() {
	queue.classAServiceTime = eval(mu1.value);
}

const mu2 = document.querySelector('#mu-2');
mu2.onchange = function() {
	queue.classBServiceTime = eval(mu2.value);
}






