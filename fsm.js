class State {
    constructor(atm) {
        this.atm = atm;
    }
    name() { return "GenericState"; }
    insertCard() {}
    enterPin() {}
    checkBalance() {}
    withdraw() {}
    deposit() {}
    payService() {}
    blockAccount() {}
    ejectCard() {}
}

/* ----- ESTADOS ----- */

class IdleState extends State {
    name() { return "Idle"; }

    insertCard() {
        this.atm.setState(new CardInsertedState(this.atm), "Tarjeta insertada");
    }
}

class CardInsertedState extends State {
    name() { return "CardInserted"; }

    enterPin() {
        const pin = prompt("Ingrese PIN:");
        if (pin === this.atm.correctPin) {
            this.atm.setState(new SelectingState(this.atm), "PIN correcto");
        } else {
            this.atm.setState(new FailureState(this.atm), "PIN incorrecto");
        }
    }
}

class SelectingState extends State {
    name() { return "Selecting"; }

    checkBalance() {
        this.atm.setState(new ProcessingState(this.atm), "Consultando saldo...");
        this.atm.setState(new SuccessState(this.atm), `Saldo actual: $${this.atm.balance}`);
        this.atm.setState(this, "Seleccione otra operación");
    }

    withdraw() {
        let amount = parseInt(prompt("Monto a retirar:"));
        this.atm.setState(new ProcessingState(this.atm), "Procesando retiro...");

        if (amount > this.atm.balance) {
            this.atm.setState(new FailureState(this.atm), "Fondos insuficientes");
        } else {
            this.atm.balance -= amount;
            this.atm.setState(new SuccessState(this.atm), `Retiro exitoso. Saldo: $${this.atm.balance}`);
        }
        this.atm.setState(this, "Seleccione otra operación");
    }

    deposit() {
        let amount = parseInt(prompt("Monto a consignar:"));
        this.atm.setState(new ProcessingState(this.atm), "Procesando consignación...");
        this.atm.balance += amount;
        this.atm.setState(new SuccessState(this.atm), `Consignación exitosa. Saldo: $${this.atm.balance}`);
        this.atm.setState(this, "Seleccione otra operación");
    }

    payService() {
        let price = parseInt(prompt("Valor del servicio:"));
        this.atm.setState(new ProcessingState(this.atm), "Pagando servicio...");

        if (price > this.atm.balance) {
            this.atm.setState(new FailureState(this.atm), "Fondos insuficientes");
        } else {
            this.atm.balance -= price;
            this.atm.setState(new SuccessState(this.atm), `Pago exitoso. Saldo: $${this.atm.balance}`);
        }
        this.atm.setState(this, "Seleccione otra operación");
    }

    blockAccount() {
        this.atm.blocked = true;
        this.atm.setState(new BlockedState(this.atm), "Cuenta bloqueada");
    }

    ejectCard() {
        this.atm.setState(new IdleState(this.atm), "Tarjeta expulsada");
    }
}

class ProcessingState extends State {
    name() { return "Processing"; }
}

class SuccessState extends State {
    name() { return "Success"; }
}

class FailureState extends State {
    name() { return "Failure"; }

    ejectCard() {
        this.atm.setState(new IdleState(this.atm), "Tarjeta expulsada");
    }
}

class BlockedState extends State {
    name() { return "Blocked"; }
}
