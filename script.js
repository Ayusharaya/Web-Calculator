//javascript
const display = document.getElementById("display");

let expression = "";


// Show expression
function updateDisplay() {
    display.value = expression;
}


// Add number/operator
function addValue(value) {

    if (expression === "Error") {
        expression = "";
    }

    expression += value;

    updateDisplay();
}


// AC button
function clearDisplay() {
    expression = "";
    updateDisplay();
}


// DEL button
function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}


// Percentage button
function percentage() {

    if (expression === "") {
        return;
    }

    // Find the last number in the expression
    let match = expression.match(/(\d+\.?\d*)$/);

    if (!match) {
        return;
    }

    let currentNumber = parseFloat(match[0]);
    let beforeExpr = expression.substring(0, match.index);

    // Check what comes before this number: <baseNumber><operator>
    let opMatch = beforeExpr.match(/(\d+\.?\d*)\s*([+\-*/])\s*$/);

    let percentValue;

    if (opMatch) {
        let baseNumber = parseFloat(opMatch[1]);
        let operator = opMatch[2];

        if (operator === "+" || operator === "-") {
            // e.g. 200 + 10%  ->  200 + (200 * 10 / 100)
            percentValue = (baseNumber * currentNumber) / 100;
        } else {
            // e.g. 200 * 10%  ->  200 * 0.1
            percentValue = currentNumber / 100;
        }
    } else {
        // Standalone percentage, e.g. just "10%" -> 0.1
        percentValue = currentNumber / 100;
    }

    // Replace last number with computed percent value
    expression = beforeExpr + percentValue.toString();

    updateDisplay();
}


// Calculate
function calculate() {

    if (expression === "") {
        return;
    }

    try {

        // Replace × if present
        let exp = expression.replace(/×/g, "*");

        // Only allow valid calculator characters
        if (!/^[0-9+\-*/().\s]+$/.test(exp)) {
            throw new Error("Invalid expression");
        }

        let result = eval(exp);

        if (!isFinite(result)) {
            throw new Error("Invalid result");
        }

        // Remove unnecessary decimal places
        result = Number(result.toFixed(10));

        expression = result.toString();

        updateDisplay();

    } catch (error) {

        expression = "Error";

        updateDisplay();
    }
}


// Keyboard support
document.addEventListener("keydown", function(event) {

    const key = event.key;

    if (key >= "0" && key <= "9") {
        addValue(key);
    }

    else if (key === "+") {
        addValue("+");
    }

    else if (key === "-") {
        addValue("-");
    }

    else if (key === "*") {
        addValue("*");
    }

    else if (key === "/") {
        addValue("/");
    }

    else if (key === ".") {
        addValue(".");
    }

    else if (key === "(" || key === ")") {
        addValue(key);
    }

    else if (key === "%") {
        percentage();
    }

    else if (key === "Enter") {
        calculate();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "Escape") {
        clearDisplay();
    }
});

