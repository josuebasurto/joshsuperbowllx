🏈 Casos de Uso - Basurto Super Bowl Hub

Esta es la lista de funcionalidades clave para la aplicación interactiva de Casa Basurto. Pensada para 7 usuarios en un entorno familiar/chill.

1. Onboarding y Personalización

ID

Caso de Uso

Descripción

UC-01

Registro de Nombre

El usuario ingresa su nombre al abrir la app por primera vez. Se guarda en localStorage.

UC-02

Selección de Equipo

El usuario elige entre Seahawks o Patriots. Esto cambia el tema visual (Header/Footer).

UC-03

Inteligencia de Equipo

Acceso a datos curiosos y stats de los equipos para usuarios que no saben a quién irle.

2. Dashboard Interactiva

ID

Caso de Uso

Descripción

UC-04

Cheve-Meter Global

Botón para sumar una cerveza al contador general. Se sincroniza en tiempo real vía Firestore.

UC-05

Countdown/Status

Visualización del tiempo restante para el Kickoff o evento más cercano.

UC-06

Agenda Inteligente

Vista de la cronología del evento. Marca automáticamente el evento actual y los pasados.

3. Competencia y Gaming (La Quiniela)

ID

Caso de Uso

Descripción

UC-07

Votación de Quiniela

Formulario de 15 preguntas (volado, primer TD, color del Gatorade, etc.).

UC-08

Bloqueo de Respuestas

Una vez enviada, la quiniela se bloquea para ese uid (no permite edición).

UC-09

Comparativa de Jugadas

Después de votar, el usuario puede ver qué eligieron los demás invitados.

4. Logística de Comida (Kitchen Hub)

ID

Caso de Uso

Descripción

UC-10

Personalización de Burger

Selector de tipo de pan, término de la carne y toppings extra.

UC-11

Envío de Comanda

Notifica al Host (Josué) el pedido específico del invitado.

UC-12

Panel del Host

Vista exclusiva (activada por nombre de usuario) para ver todos los pedidos pendientes.

5. Aspectos Técnicos y Persistencia

Real-time: Uso de onSnapshot para que el contador de cheves y quinielas se actualice sin refrescar.

Identificación: Uso de Anonymous Auth de Firebase combinado con localStorage.

Colores NFL: * Seahawks: Action Green (#69BE28) y College Navy (#002244).

Patriots: Nautical Blue (#002244) y New Century Red (#C60C30).

Sugerencia: En VS Code, puedes usar estos casos de uso como base para tus archivos de pruebas o para documentar el README.md de tu repo.