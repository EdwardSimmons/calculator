import { Component } from 'react';
import CalculatorButton from './CalculatorButton';
import './App.css';
import { evaluate } from 'mathjs';


class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buttons: [
                {
                    id: "zero",
                    value: "0",
                    operation: null,
                },
                {
                    id: "one",
                    value: "1",
                    operation: null,
                },
                {
                    id: "two",
                    value: "2",
                    operation: null,
                },
                {
                    id: "three",
                    value: "3",
                    operation: null,
                },
                {
                    id: "four",
                    value: "4",
                    operation: null,
                },
                {
                    id: "five",
                    value: "5",
                    operation: null,
                },
                {
                    id: "six",
                    value: "6",
                    operation: null,
                },
                {
                    id: "seven",
                    value: "7",
                    operation: null,
                },
                {
                    id: "eight",
                    value: "8",
                    operation: null,
                },
                {
                    id: "nine",
                    value: "9",
                    operation: null,
                },
                {
                    id: "add",
                    value: null,
                    operation: "+",
                },
                {
                    id: "subtract",
                    value: null,
                    operation: "-",
                },
                {
                    id: "multiply",
                    value: null,
                    operation: "*",
                },
                {
                    id: "divide",
                    value: null,
                    operation: "/",
                },
                {
                    id: "decimal",
                    value: null,
                    operation: ".",
                },
                {
                    id: "equals",
                    value: null,
                    operation: "=",
                },
                {
                    id: "clear",
                    value: null,
                    operation: null,
                },
            ],
            input: "",
            output: "",
        }
    }

    handleExpression(buttonId) {
        const i = this.state.buttons.findIndex(btn => btn.id === buttonId);
        const pressedBtn = this.state.buttons[i];

        // Handle clear button
        if (!pressedBtn?.value && !pressedBtn?.operation) {
            this.setState({
                input: "",
                output: "",
            });
            return;
        }

        let currentInput = this.state.input;
        let newInput = currentInput;
        let currentOutput = this.state.output
        let newOutput = currentOutput;

        if (!currentOutput && pressedBtn.operation !== "=") {
            // From fresh, anything is fine
            newInput = pressedBtn.operation || pressedBtn.value;
            newOutput = pressedBtn.operation || pressedBtn.value;
        } else {
            if (pressedBtn.operation) {
                if (pressedBtn.operation === "." && currentOutput.includes(".")) {
                    // Don't add extra decimals
                    newInput = currentInput;
                    newOutput = currentOutput;
                } else {
                    if (this.isOperation(currentInput.slice(-1))) {
                        // Last charater was an operand
                        newOutput = pressedBtn.operation;
                        // Allow double negative, replace if else
                        if (pressedBtn.operation === "-" && currentInput.slice(-1) === "-") {
                            newInput = currentInput.includes("--") ? currentInput : currentInput + pressedBtn.operation
                        } else if (pressedBtn.operation === "-" && ["*", "/", "+"].includes(currentInput.slice(-1))) {
                            newInput += pressedBtn.operation;
                        } else {
                            const operandPos = currentInput.split("").findIndex(char => this.isOperation(char));
                            newInput = newInput.slice(0, operandPos);
                            newInput += pressedBtn.operation;
                        }
                    } else {
                        // Last character was a number
                        if (pressedBtn.operation === "=") {
                            // Don't evaluate if "/" is the first character
                            newOutput = newInput.slice(0, 1) === "/" ? currentOutput : evaluate(newInput);
                            newInput += pressedBtn.operation;
                        } else if (currentInput.includes("=")) {
                            // Pressed an operation after evaluating
                            newInput = currentOutput + pressedBtn.operation;
                            newOutput = pressedBtn.operation;
                        } else {
                            newInput += pressedBtn.operation;
                            newOutput = pressedBtn.operation === "." ? newOutput + pressedBtn.operation : pressedBtn.operation;
                        }
                    }
                }
            } else if (!(pressedBtn.value === "0" && currentInput === "0")) {
                // Pressed a number
                // Don't allow multiple zeroes at begging of expression
                if (currentInput.includes("=")) {
                    // Pressed a number after evaluating
                    newInput = pressedBtn.value;
                    newOutput = pressedBtn.value;
                } else {
                    newInput += pressedBtn.value;
                    if (this.isOperation(currentOutput.slice(-1))) {
                        newOutput = pressedBtn.value;
                    } else {
                        newOutput += pressedBtn.value;
                    }
                }
            }
        }

        this.setState({
            input: newInput,
            output: newOutput,
        });
    }

    isOperation(currentOutput) {
        const operations = ["+", "-", "*", "/"];
        // console.log("[ isOperation ]", currentOutput, !isNaN(operations.find(op => op === currentOutput)))
        return !!operations.find(op => op === currentOutput);
    }

    render() {
        return (
            <div className="container">
                <div>
                    <div>{this.state.input}</div>
                    <div id="display">{this.state.output || "0"}</div>
                </div>
                {this.state.buttons.map((button, index) => {
                    return <CalculatorButton
                        id={button.id}
                        value={button.value}
                        operation={button.operation}
                        key={index}
                        handleExpression={this.handleExpression.bind(this)}
                    />
                })}
            </div>
        );
    }
}

export default Calculator;
