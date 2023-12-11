import { Component } from 'react';
import './App.css';


class CalculatorButton extends Component {
    constructor(props) {
        super(props)

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onClickButton = this.onClickButton.bind(this);

        this.state = {
            //
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    };

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(e) {
        if (
            e.repeat
            || (e.key.toLowerCase() !== this.props.value?.toLowerCase()
                && e.key.toLowerCase() !== this.props.operation?.toLowerCase())
        ) return;

        this.onClickButton();
    }

    onClickButton() {
        this.props.handleExpression(this.props.id)
    }

    render() {
        return (
            <button id={this.props.id} className="calculator-button" onClick={this.onClickButton.bind(this)}>
                {this.props.value || this.props.operation || "AC"}
            </button>
        );
    }
}

export default CalculatorButton;
