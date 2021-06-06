class Session {
	constructor(config) {
		this.workSessionsCounter = 0;
		this.initialTime = 1;
		this.sessionsCounter = 0;
		this.displayElement = config.displayElement;

		//timer and display time
		this.timer = new Timer({
			tick: 1,
			ontick: (ms) => {
				let sec = Math.floor(ms / 1000);
				let min = Math.floor((ms / 1000) / 60);
				let _displaySec = sec - min * 60;

				this.displayTime = `${min}:${_displaySec}`;
				this.displayElement.innerHTML = this.displayTime;
			},
		});
	}

	setDisplayTime(time) {
		this.displayTime = time;
		this.displayElement.innerHTML = this.displayTime;
	}

	tooglePlay() {
		if (this.timer.getStatus() === "initialized" || this.timer.getStatus() === "stopped") {
			this.timer.start(this.initialTime);
		} else if (this.timer.getStatus() === "started") {
			this.timer.pause();
		} else if (this.timer.getStatus() === "paused") {
			this.timer.start();
		}
	}

	stop() {
		this.timer.stop();
	}

	//return this.initialTime in a 00:00 string format
	initialSecToTime() {
		let sec = this.initialTime;
		let min = Math.floor(this.initialTime / 60);
		let _displaySec = sec - min * 60;

		return `${min}:${_displaySec}`;
	}
}

// getting html elements and notification
const sessionType = document.querySelector(".session-type");
const displayTimer = document.querySelector(".timer");
const sessionsDots = document.querySelectorAll(".sessions span");
const notifiaction = new Audio("./assets/notification.wav");


// defining sessions times
let workSessionTime = 1;
let shortBreakTime = 1;
let longBreakTime = 10;

// starting the timer
session = new Session({
	displayElement: displayTimer,
	initialTime: workSessionTime,
});
session.setDisplayTime(session.initialSecToTime());


// restar hole session
const restartSession = () => {
	session.stop()
	session.initialTime = workSessionTime;
	session.setDisplayTime(session.initialSecToTime());
	session.sessionsCounter = 0;
	session.workSessionsCounter = 0;
	sessionsDots.forEach(dot => {
		dot.style.backgroundImage = "url('./assets/icons/circule.svg')";
	});
}

//buttons events
const playButton = document.querySelector(".buttons__play").addEventListener("click", () => {
	session.tooglePlay();
});

const restartButon = document.querySelector(".buttons__rest-time").addEventListener("click", () => {
	session.stop();
	session.setDisplayTime(session.initialSecToTime());
});

const setWorkTimeButton = document.querySelector(".accept-work-time button").addEventListener("click", () => {
	workSessionTime = document.querySelector(".accept-work-time input").value * 60;
	session.setDisplayTime(session.initialSecToTime());
	restartSession();
});

const setLongTimeButton = document.querySelector(".accept-long-time button").addEventListener("click", () => {
	longBreakTime = document.querySelector(".accept-long-time input").value * 60;
	session.setDisplayTime(session.initialSecToTime())
	restartSession()

});

const setShortTimeButton = document.querySelector(".accept-short-time button").addEventListener("click", () => {
	shortBreakTime = document.querySelector(".accept-short-time input").value * 60;
	session.setDisplayTime(session.initialSecToTime())
	restartSession()
});


// implementing logic for the 3 types of times at the end of a session
session.timer.on("end", () => {
	//last break case
	if (session.sessionsCounter === 15) {
		window.location.reload();
	} else if (session.sessionsCounter === 6) {
		//changing the time and the dom after the dom in the end of a work session and checking if its time for a long break 
		session.initialTime = longBreakTime;
		session.setDisplayTime(session.initialSecToTime());

		sessionsDots[session.workSessionsCounter].style.backgroundImage = "url('./assets/icons/full-circle.svg')";
		sessionType.innerHTML = "Long Break!";
		notifiaction.play();

		session.workSessionsCounter++;
	} else if (session.sessionsCounter % 2 == 0 && session.sessionsCounter != 7) {
		//changing the time and the dom after the end of a work session and checking if its time for a short break 
		session.initialTime = shortBreakTime;
		session.setDisplayTime(session.initialSecToTime());

		sessionsDots[session.workSessionsCounter].style.backgroundImage = "url('./assets/icons/full-circle.svg')";
		sessionType.innerHTML = "Short Break!";
		notifiaction.play();

		session.workSessionsCounter++;
	} else {
		//end of a break session, preparing time for a work session 
		session.initialTime = workSessionTime;
		notifiaction.play();

		session.setDisplayTime(session.initialSecToTime());
		sessionType.innerHTML = "Work!";
	}
	session.sessionsCounter++;
})
