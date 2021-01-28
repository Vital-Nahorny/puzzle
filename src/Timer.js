class Timer {
  constructor(textElemTime) {
    this.textElemTime = textElemTime;
    this.time = {
      min: 0,
      sec: 0,
    };
    this.timer = null;
  }

  init = () => {
    const currSec = this.time.sec <= 9 ? `0${this.time.sec}` : String(this.time.sec);
    const currMin = this.time.min <= 9 ? `0${this.time.min}` : String(this.time.min);
    this.textElemTime.innerText = `Time ${currMin} : ${currSec}`;
  }

  refreshTime = () => {
    const currSec = this.time.sec <= 9 ? `0${this.time.sec}` : String(this.time.sec);
    const currMin = this.time.min <= 9 ? `0${this.time.min}` : String(this.time.min);
    this.time.sec += 1;
    if (this.time.sec === 60) {
      this.time.min += 1;
      this.time.sec = 0;
    }
    this.textElemTime.innerText = `Time ${currMin} : ${currSec}`;
  }

  clearTime = () => {
    this.time.sec = 0;
    this.time.min = 0;
  }

  getTime = () => ({
    min: this.time.min,
    sec: this.time.sec,
  })

  startTimer = () => {
    if (this.timer) return;
    this.timer = setInterval(this.refreshTime, 1000);
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.timer = null;
  }

  setTime = ({ sec, min }) => {
    this.time.sec = sec;
    this.time.min = min;
  }
}

// const textElemTime = document.querySelector('.time-output');
// const btnStart = document.querySelector('.start-timer');
// const btnStop = document.querySelector('.stop-timer');

// const myTimer = new Timer(textElemTime);

// btnStart.addEventListener('click', myTimer.startTimer);
// btnStop.addEventListener('click',  myTimer.stopTimer);

export default Timer;
