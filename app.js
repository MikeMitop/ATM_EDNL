class ATM {
    constructor() {
        this.balance = 1000;
        this.correctPin = "1234";
        this.blocked = false;

        this.state = new IdleState(this);

        this.uiState = document.getElementById("state");
        this.uiAction = document.getElementById("action");
        this.logElem = document.getElementById("log");

        this.render("Sistema iniciado");
    }

    setState(newState, action) {
        this.state = newState;
        this.render(action);
    }

    render(action) {
        this.uiState.textContent = this.state.name();
        this.uiAction.textContent = action;
        this.log(`[${this.state.name()}] ${action}`);
    }

    log(msg) {
        this.logElem.innerHTML += msg + "<br>";
        this.logElem.scrollTop = this.logElem.scrollHeight;
    }

    /* Controlador: delega en el estado actual */
    insertCard()   { this.state.insertCard(); }
    enterPin()     { this.state.enterPin(); }
    checkBalance() { this.state.checkBalance(); }
    withdraw()     { this.state.withdraw(); }
    deposit()      { this.state.deposit(); }
    payService()   { this.state.payService(); }
    blockAccount() { this.state.blockAccount(); }
    ejectCard()    { this.state.ejectCard(); }
}

const controller = new ATM();
