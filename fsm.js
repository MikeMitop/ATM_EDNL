class State {
    constructor(atm) {
        this.atm = atm;
    }
    name() { return "GenericState"; }
    insertCard() { 
        this.atm.log("Acción no permitida en este estado", "warning");
    }
    enterPin() { 
        this.atm.log("Acción no permitida en este estado", "warning");
    }
    checkBalance() { 
        this.atm.log("Acción no permitida en este estado", "warning");
    }
    withdraw() { 
        this.atm.log("Acción no permitida en este estado", "warning");
    }
    deposit() { 
        this.atm.log("Acción no permitida en este estado", "warning");
    }
    payService() { 
        this.atm.log("Acción no permitida en este estado", "warning");
    }
    blockAccount() { 
        this.atm.log("Acción no permitida en este estado", "warning");
    }
    ejectCard() { 
        this.atm.log("Acción no permitida en este estado", "warning");
    }

    // Utilidades para validación
    validatePositiveAmount(amount) {
        if (amount === null || amount === "") {
            return { valid: false, error: "Operación cancelada" };
        }
        
        const numAmount = parseFloat(amount);
        
        if (isNaN(numAmount)) {
            return { valid: false, error: "Valor ingresado no es válido" };
        }
        
        if (numAmount <= 0) {
            return { valid: false, error: "El monto debe ser mayor a cero" };
        }
        
        if (!Number.isInteger(numAmount)) {
            return { valid: false, error: "El monto debe ser un número entero" };
        }
        
        return { valid: true, value: numAmount };
    }
}

/* ----- ESTADOS ----- */

class IdleState extends State {
    name() { return "Idle"; }

    insertCard() {
        if (this.atm.blocked) {
            this.atm.setState(new BlockedState(this.atm), "Cuenta bloqueada. No se puede usar la tarjeta", "error");
            return;
        }
        this.atm.setState(new CardInsertedState(this.atm), "Tarjeta insertada. Por favor ingrese su PIN", "success");
    }

    enterPin() {
        this.atm.log("Primero debe insertar la tarjeta", "warning");
    }

    checkBalance() {
        this.atm.log("Primero debe insertar la tarjeta", "warning");
    }

    withdraw() {
        this.atm.log("Primero debe insertar la tarjeta", "warning");
    }

    deposit() {
        this.atm.log("Primero debe insertar la tarjeta", "warning");
    }

    payService() {
        this.atm.log("Primero debe insertar la tarjeta", "warning");
    }

    blockAccount() {
        this.atm.log("Primero debe insertar la tarjeta", "warning");
    }

    ejectCard() {
        this.atm.log("No hay ninguna tarjeta insertada", "warning");
    }
}

class CardInsertedState extends State {
    name() { return "CardInserted"; }

    enterPin() {
        const pin = prompt("🔑 Ingrese su PIN de 4 dígitos:");
        
        if (pin === null || pin === "") {
            this.atm.setState(new IdleState(this.atm), "Operación cancelada. Tarjeta expulsada", "warning");
            return;
        }

        if (!/^\d{4}$/.test(pin)) {
            this.atm.pinAttempts++;
            if (this.atm.pinAttempts >= this.atm.maxPinAttempts) {
                this.atm.blocked = true;
                this.atm.setState(new BlockedState(this.atm), "Demasiados intentos fallidos. Cuenta bloqueada", "error");
            } else {
                this.atm.log(`PIN inválido. Intento ${this.atm.pinAttempts} de ${this.atm.maxPinAttempts}`, "error");
                this.atm.setState(new FailureState(this.atm), "PIN debe ser de 4 dígitos", "error");
            }
            return;
        }

        if (pin === this.atm.correctPin) {
            this.atm.pinAttempts = 0;
            this.atm.setState(new SelectingState(this.atm), "✅ PIN correcto. Bienvenido!", "success");
        } else {
            this.atm.pinAttempts++;
            if (this.atm.pinAttempts >= this.atm.maxPinAttempts) {
                this.atm.blocked = true;
                this.atm.setState(new BlockedState(this.atm), "Demasiados intentos fallidos. Cuenta bloqueada", "error");
            } else {
                this.atm.log(`Intento ${this.atm.pinAttempts} de ${this.atm.maxPinAttempts}`, "warning");
                this.atm.setState(new FailureState(this.atm), "❌ PIN incorrecto", "error");
            }
        }
    }

    insertCard() {
        this.atm.log("Ya hay una tarjeta insertada", "warning");
    }

    ejectCard() {
        this.atm.setState(new IdleState(this.atm), "Tarjeta expulsada", "info");
    }
}

class SelectingState extends State {
    name() { return "Selecting"; }

    checkBalance() {
        this.atm.setState(new ProcessingState(this.atm), "🔄 Consultando saldo...", "info");
        setTimeout(() => {
            this.atm.setState(new SuccessState(this.atm), `💰 Saldo actual: $${this.atm.balance.toLocaleString()}`, "success");
            setTimeout(() => {
                this.atm.setState(this, "Seleccione otra operación", "info");
            }, 1500);
        }, 800);
    }

    withdraw() {
        const amountStr = prompt("💸 Ingrese el monto a retirar:");
        
        const validation = this.validatePositiveAmount(amountStr);
        if (!validation.valid) {
            this.atm.log(validation.error, "warning");
            return;
        }

        const amount = validation.value;

        if (amount > this.atm.balance) {
            this.atm.setState(new ProcessingState(this.atm), "🔄 Procesando retiro...", "info");
            setTimeout(() => {
                this.atm.setState(new FailureState(this.atm), "❌ Fondos insuficientes", "error");
                setTimeout(() => {
                    this.atm.setState(this, "Seleccione otra operación", "info");
                }, 1500);
            }, 800);
            return;
        }

        this.atm.setState(new ProcessingState(this.atm), "🔄 Procesando retiro...", "info");
        setTimeout(() => {
            this.atm.balance -= amount;
            this.atm.setState(new SuccessState(this.atm), `✅ Retiro exitoso de $${amount.toLocaleString()}. Saldo: $${this.atm.balance.toLocaleString()}`, "success");
            setTimeout(() => {
                this.atm.setState(this, "Seleccione otra operación", "info");
            }, 1500);
        }, 800);
    }

    deposit() {
        const amountStr = prompt("💵 Ingrese el monto a consignar:");
        
        const validation = this.validatePositiveAmount(amountStr);
        if (!validation.valid) {
            this.atm.log(validation.error, "warning");
            return;
        }

        const amount = validation.value;

        if (amount > 1000000) {
            this.atm.log("El monto máximo de consignación es $1,000,000", "warning");
            return;
        }

        this.atm.setState(new ProcessingState(this.atm), "🔄 Procesando consignación...", "info");
        setTimeout(() => {
            this.atm.balance += amount;
            this.atm.setState(new SuccessState(this.atm), `✅ Consignación exitosa de $${amount.toLocaleString()}. Saldo: $${this.atm.balance.toLocaleString()}`, "success");
            setTimeout(() => {
                this.atm.setState(this, "Seleccione otra operación", "info");
            }, 1500);
        }, 800);
    }

    payService() {
        const priceStr = prompt("🧾 Ingrese el valor del servicio a pagar:");
        
        const validation = this.validatePositiveAmount(priceStr);
        if (!validation.valid) {
            this.atm.log(validation.error, "warning");
            return;
        }

        const price = validation.value;

        if (price > this.atm.balance) {
            this.atm.setState(new ProcessingState(this.atm), "🔄 Procesando pago...", "info");
            setTimeout(() => {
                this.atm.setState(new FailureState(this.atm), "❌ Fondos insuficientes", "error");
                setTimeout(() => {
                    this.atm.setState(this, "Seleccione otra operación", "info");
                }, 1500);
            }, 800);
            return;
        }

        this.atm.setState(new ProcessingState(this.atm), "🔄 Procesando pago...", "info");
        setTimeout(() => {
            this.atm.balance -= price;
            this.atm.setState(new SuccessState(this.atm), `✅ Pago exitoso de $${price.toLocaleString()}. Saldo: $${this.atm.balance.toLocaleString()}`, "success");
            setTimeout(() => {
                this.atm.setState(this, "Seleccione otra operación", "info");
            }, 1500);
        }, 800);
    }

    blockAccount() {
        const confirm = window.confirm("⚠️ ¿Está seguro que desea bloquear su cuenta?");
        if (!confirm) {
            this.atm.log("Operación de bloqueo cancelada", "info");
            return;
        }
        
        this.atm.blocked = true;
        this.atm.setState(new BlockedState(this.atm), "🔒 Cuenta bloqueada exitosamente", "error");
    }

    ejectCard() {
        this.atm.setState(new IdleState(this.atm), "⏏️ Tarjeta expulsada. ¡Gracias por usar nuestro servicio!", "info");
    }

    insertCard() {
        this.atm.log("Ya hay una tarjeta insertada y autenticada", "warning");
    }
}

class ProcessingState extends State {
    name() { return "Processing"; }

    insertCard() {
        this.atm.log("Operación en proceso. Por favor espere", "warning");
    }

    ejectCard() {
        this.atm.log("Operación en proceso. Por favor espere", "warning");
    }
}

class SuccessState extends State {
    name() { return "Success"; }

    insertCard() {
        this.atm.log("Ya hay una sesión activa", "warning");
    }

    ejectCard() {
        this.atm.log("Procesando resultado. Por favor espere", "warning");
    }
}

class FailureState extends State {
    name() { return "Failure"; }

    ejectCard() {
        this.atm.setState(new IdleState(this.atm), "⏏️ Tarjeta expulsada", "info");
    }

    insertCard() {
        this.atm.log("Ya hay una tarjeta insertada", "warning");
    }

    enterPin() {
        const pin = prompt("🔑 Ingrese su PIN de 4 dígitos:");
        
        if (pin === null || pin === "") {
            this.atm.setState(new IdleState(this.atm), "Operación cancelada. Tarjeta expulsada", "warning");
            return;
        }

        if (!/^\d{4}$/.test(pin)) {
            this.atm.pinAttempts++;
            if (this.atm.pinAttempts >= this.atm.maxPinAttempts) {
                this.atm.blocked = true;
                this.atm.setState(new BlockedState(this.atm), "Demasiados intentos fallidos. Cuenta bloqueada", "error");
            } else {
                this.atm.log(`PIN inválido. Intento ${this.atm.pinAttempts} de ${this.atm.maxPinAttempts}`, "error");
                this.atm.render("PIN debe ser de 4 dígitos", "error");
            }
            return;
        }

        if (pin === this.atm.correctPin) {
            this.atm.pinAttempts = 0;
            this.atm.setState(new SelectingState(this.atm), "✅ PIN correcto. Bienvenido!", "success");
        } else {
            this.atm.pinAttempts++;
            if (this.atm.pinAttempts >= this.atm.maxPinAttempts) {
                this.atm.blocked = true;
                this.atm.setState(new BlockedState(this.atm), "Demasiados intentos fallidos. Cuenta bloqueada", "error");
            } else {
                this.atm.log(`Intento ${this.atm.pinAttempts} de ${this.atm.maxPinAttempts}`, "warning");
                this.atm.render("❌ PIN incorrecto", "error");
            }
        }
    }
}

class BlockedState extends State {
    name() { return "Blocked"; }

    constructor(atm) {
        super(atm);
        // Expulsar tarjeta automáticamente después de 5 segundos y reiniciar el cajero
        this.atm.log("⚠️ Tarjeta será retenida por seguridad", "error");
        this.atm.log("Por favor contacte a su banco para desbloquear su cuenta", "error");
        
        setTimeout(() => {
            this.atm.log("🔄 Reiniciando sistema...", "warning");
            setTimeout(() => {
                this.atm.blocked = false;
                this.atm.pinAttempts = 0;
                this.atm.setState(new IdleState(this.atm), "Sistema reiniciado. Puede intentar nuevamente", "info");
            }, 2000);
        }, 5000);
    }

    insertCard() {
        this.atm.log("🔒 Sistema bloqueado. Espere a que se reinicie", "error");
    }

    enterPin() {
        this.atm.log("🔒 Sistema bloqueado. Espere a que se reinicie", "error");
    }

    checkBalance() {
        this.atm.log("🔒 Sistema bloqueado. Espere a que se reinicie", "error");
    }

    withdraw() {
        this.atm.log("🔒 Sistema bloqueado. Espere a que se reinicie", "error");
    }

    deposit() {
        this.atm.log("🔒 Sistema bloqueado. Espere a que se reinicie", "error");
    }

    payService() {
        this.atm.log("🔒 Sistema bloqueado. Espere a que se reinicie", "error");
    }

    blockAccount() {
        this.atm.log("🔒 La cuenta ya está bloqueada", "warning");
    }

    ejectCard() {
        this.atm.log("🔒 Sistema bloqueado. Espere a que se reinicie", "error");
    }
}
