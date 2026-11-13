# Brief · a Claude Code mod

**[Español](#español) · [English](#english)**

---

## Español

Escribes un mensaje largo y desordenado. Brief lo convierte en un brief claro antes de que Claude lo lea, **en el mismo idioma en el que escribiste**.

### Qué hace
- Se activa solo con mensajes de **100 palabras o más**. Los cortos pasan sin tocarlos.
- Ordena tu mensaje en secciones: **Objetivo · Contexto · Lo que necesito · Límites y formato · Preguntas abiertas** (máximo 3, solo si algo es ambiguo).
- Conserva todos los datos, nombres, cifras y enlaces. Lo que tenga que suponer lo marca como *(supuesto)*.
- Encima del cuadro de texto ves el brief con cuatro botones: **Enviar brief**, **Enviar mi texto**, **Editar** y **Cancelar**.
- Al enviar el brief, Claude también recibe tu texto original (sin que lo veas en el chat) por si al brief le faltara algún detalle.

### Cómo se usa
- Empieza un mensaje con `raw:` para enviarlo tal cual.
- `/brief` apaga el mod y lo vuelve a encender.
- Usa Claude Haiku para ordenar el mensaje: es rápido y gasta muy poco de tu plan, y solo en mensajes largos.

### Instalación
En una sesión de Claude Code en la terminal:

```
/plugin marketplace add gerardocolindresx/claude-mods
/plugin install brief@claude-mods
```

Elige el alcance cuando te lo pregunte (usuario, para todos tus proyectos).

Desde la terminal del sistema:

```
claude plugin marketplace add gerardocolindresx/claude-mods
claude plugin install brief@claude-mods
```

En la app de escritorio: pulsa **+** junto al cuadro de texto → **Plugins** → **Add marketplace** con `gerardocolindresx/claude-mods` → **Add plugin**.

### Privacidad
El mod no se conecta a ningún servicio externo, no ejecuta comandos y no escribe archivos. Solo usa la API de mods de Claude Code y una llamada al modelo de Claude con tu propio plan.

---

## English

You write a long, messy message. Brief turns it into a clear brief before Claude reads it, **in the same language you wrote in**.

### What it does
- Kicks in only for messages of **100 words or more**. Short ones go through untouched.
- Sorts your message into: **Goal · Context · What I need · Constraints and format · Open questions** (three at most, only real ambiguities).
- Keeps every fact, name, number and link. Anything it has to fill in is marked *(assumption)*.
- A band above the prompt shows the brief with four buttons: **Send brief**, **Send my text**, **Edit** and **Cancel**.
- When you send the brief, Claude also gets your original text (hidden from the chat) in case the brief missed a detail.

### Usage
- Start a message with `raw:` to send it as written.
- `/brief` turns the mod off and back on.
- It uses Claude Haiku to sort the message: fast and light on your plan, and only for long messages.

### Install
At the prompt of a Claude Code terminal session:

```
/plugin marketplace add gerardocolindresx/claude-mods
/plugin install brief@claude-mods
```

Pick a scope when asked (user, for all your projects).

From a shell:

```
claude plugin marketplace add gerardocolindresx/claude-mods
claude plugin install brief@claude-mods
```

In the desktop app: click **+** next to the prompt box → **Plugins** → **Add marketplace** with `gerardocolindresx/claude-mods` → **Add plugin**.

### Privacy
The mod calls no outside service, runs no commands and writes no files. It only uses the Claude Code mod API and one Claude model call on your own plan.

---

MIT License · Gerardo Colindres
