class ATM {
    constructor() {
        this.balance = 1000;
        this.correctPin = "1234";
        this.blocked = false;
        this.pinAttempts = 0;
        this.maxPinAttempts = 3;

        this.state = new IdleState(this);

        this.uiState = document.getElementById("state");
        this.uiAction = document.getElementById("action");
        this.logElem = document.getElementById("log");

        this.render("Sistema iniciado", "info");
    }

    setState(newState, action, logType = "info") {
        this.state = newState;
        this.render(action, logType);
    }

    render(action, logType = "info") {
        // Update state display
        this.uiState.textContent = this.state.name();
        this.uiAction.textContent = action;
        
        // Apply styling based on state
        this.updateStateStyle();
        
        // Log the action
        this.log(`[${this.state.name()}] ${action}`, logType);
    }

    updateStateStyle() {
        // Remove all state classes
        this.uiState.classList.remove('state-active', 'state-error', 'state-warning');
        this.uiAction.classList.remove('state-active', 'state-error', 'state-warning');
        
        const stateName = this.state.name();
        
        if (stateName === 'Success' || stateName === 'Selecting') {
            this.uiState.classList.add('state-active');
            this.uiAction.classList.add('state-active');
        } else if (stateName === 'Failure' || stateName === 'Blocked') {
            this.uiState.classList.add('state-error');
            this.uiAction.classList.add('state-error');
        } else if (stateName === 'Processing' || stateName === 'CardInserted') {
            this.uiState.classList.add('state-warning');
            this.uiAction.classList.add('state-warning');
        }
    }

    log(msg, type = "info") {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${msg}`;
        this.logElem.appendChild(logEntry);
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
