
import './Button.css';

function Button() {
  return (
    <div className="btn" onClick={btnClicked}>
        <button>Test</button>
    </div>
  );
}

function btnClicked() {
  alert("Button is clicked");
}

export default Button;
