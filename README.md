# ATM_EDNL - Cajero Automático FSM

Aplicación web de cajero automático implementada con Máquina de Estados Finitos (FSM) usando JavaScript Orientado a Objetos.

## 🎯 Características

### Servicios Disponibles
- 💰 **Consulta de saldo**: Visualiza tu saldo actual
- 💸 **Retiro de dinero**: Retira efectivo con validación de fondos
- 💵 **Consignación**: Deposita dinero a tu cuenta (hasta $1,000,000)
- 🧾 **Pago de servicios**: Paga tus servicios con validación de fondos
- 🔒 **Bloqueo de cuenta**: Bloquea tu cuenta por seguridad

### Estados del Sistema FSM
El cajero implementa 7 estados diferentes:
1. **Idle**: Estado inicial esperando tarjeta
2. **CardInserted**: Tarjeta insertada, esperando PIN
3. **Selecting**: Usuario autenticado, seleccionando operación
4. **Processing**: Procesando transacción
5. **Success**: Operación exitosa
6. **Failure**: Operación fallida
7. **Blocked**: Cuenta bloqueada

## 🎨 Interfaz de Usuario

- Diseño moderno tipo ATM con gradientes y colores profesionales
- Indicadores visuales de estado con código de colores:
  - 🟢 Verde: Estados exitosos (Success, Selecting)
  - 🟠 Naranja: Estados de advertencia (CardInserted, Processing)
  - 🔴 Rojo: Estados de error (Failure, Blocked)
- Panel de estados que muestra todos los estados posibles
- Registro de transacciones con timestamps
- Botones organizados con iconos emoji
- Diseño responsive para diferentes pantallas

## 🔒 Seguridad y Validación

- **Validación de PIN**: Debe ser de 4 dígitos numéricos
- **Intentos máximos**: 3 intentos de PIN antes de bloqueo automático
- **Validación de montos**: Solo acepta números enteros positivos
- **Límite de consignación**: Máximo $1,000,000 por transacción
- **Validación de fondos**: Verifica fondos suficientes en retiros y pagos
- **Manejo de errores**: Captura y maneja todas las excepciones de entrada

## 🚀 Cómo Usar

1. Abre `index.html` en tu navegador web
2. **Consulta el PIN**: Haz clic en "🔍 Consultar PIN" para ver las credenciales de prueba
3. Haz clic en "💳 Insertar Tarjeta"
4. Ingresa el PIN (por defecto: **1234**)
5. Selecciona la operación deseada
6. Sigue las instrucciones en pantalla

### 🔐 Manejo de Bloqueos

El cajero simula el comportamiento real de un ATM:
- **3 intentos de PIN**: Si ingresas el PIN incorrecto 3 veces, la cuenta se bloquea
- **Bloqueo automático**: La tarjeta es retenida temporalmente por seguridad
- **Reinicio automático**: Después de 7 segundos, el sistema se reinicia automáticamente
- **Bloqueo manual**: Si seleccionas "Bloquear Cuenta", el sistema también se reiniciará después de un tiempo

⚠️ **Nota**: El reinicio automático es una funcionalidad de demostración. En un cajero real, se requeriría contactar al banco para desbloquear la cuenta.

## 🛠️ Tecnologías

- HTML5
- CSS3 (con gradientes y animaciones)
- JavaScript ES6+ (Programación Orientada a Objetos)
- Patrón de diseño: State Pattern (FSM)

## 📁 Estructura de Archivos

```
ATM_EDNL/
├── index.html    # Interfaz de usuario y estilos
├── app.js        # Clase principal ATM y controlador
├── fsm.js        # Implementación de estados FSM
└── README.md     # Documentación
```

## 🔐 Credenciales de Prueba

El cajero muestra visiblemente la información de la tarjeta de prueba:
- **Número de tarjeta**: 1234 5678 9012 3456
- **PIN**: 1234 (también disponible mediante el botón "Consultar PIN")
- **Saldo inicial**: $1,000

💡 **Tip**: El botón "🔍 Consultar PIN" muestra la información de la tarjeta sin necesidad de revisar el código fuente.

## 📝 Notas Técnicas

- La aplicación usa el patrón State para implementar la FSM
- Cada estado es una clase que hereda de la clase base `State`
- Las transiciones de estado son manejadas automáticamente
- Incluye timeouts realistas para simular procesamiento de transacciones
- Todos los estados registran sus acciones en el log con timestamps

## 👨‍💻 Autor

Proyecto educativo para demostrar implementación de FSM en aplicaciones web.