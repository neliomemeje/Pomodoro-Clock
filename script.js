function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);

  function breakSound() {
    let sound = new Audio("./break sound.mp3");
    sound.currentTime = 0;
    sound.play();
  }
  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
  }

  function changeTime(amount, type) {
    if (type === "Break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else if (type === "Session") {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  }

  function controlTime() {
    let second = 1000;
    let date = new Date().getTime();
    let newDate = new Date().getTime() + second;
    let onBreakVar = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > newDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVar) {
              breakSound();
              onBreakVar = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVar) {
              breakSound();
              onBreakVar = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          newDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval"));
    }
    setTimerOn(!timerOn);
  }

  function renewTime() {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    let el = document.querySelector(".main > h4");
    el.textContent = "Session Time";
  }

  return (
    <div className="center-align">
      <h2>Pomodoro Clock</h2>
      <div className="underline #e53935 red darken-1"></div>
      <div className="main">
        <div className="dual-container">
          <Break
            // title={"Break length"}
            changeTime={changeTime}
            type={"Break"}
            time={breakTime}
            formatTime={formatTime}
          />
          <Session
            // title={"Session length"}
            changeTime={changeTime}
            type={"Session"}
            time={sessionTime}
            formatTime={formatTime}
          />
        </div>
        <h4 id="timer-label">{onBreak ? "Break Time" : "Session Time"}</h4>
        <h1 id="time-left">{formatTime(displayTime)}</h1>
        <button
          id="start_stop"
          className="btn-large #e53935 red darken-1"
          onClick={controlTime}
        >
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>
        <button
          id="reset"
          className="btn-large #e53935 red darken-1"
          onClick={renewTime}
        >
          <i className="material-icons">autorenew</i>
        </button>
      </div>
    </div>
  );
}

function Break({ changeTime, type, time, formatTime }) {
  return (
    <div className="session-container">
      <h4 id="break-label">Break length</h4>
      <div className="time-sets">
        <button
          id="break-decrement"
          className="#e53935 red darken-1 arrow"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3 id="break-length">{formatTime(time)}</h3>
        <button
          id="break-increment"
          className="#e53935 red darken-1 arrow"
          onClick={() => changeTime(+60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

function Session({ changeTime, type, time, formatTime }) {
  return (
    <div className="session-container">
      <h4 id="session-label">Session Length</h4>
      <div className="time-sets">
        <button
          id="session-decrement"
          className="#e53935 red darken-1 arrow"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3 id="session-length">{formatTime(time)}</h3>
        <button
          id="session-increment"
          className="#e53935 red darken-1 arrow"
          onClick={() => changeTime(+60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("app")).render(<App />);
