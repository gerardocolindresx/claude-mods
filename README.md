# Claude mods · Gerardo Colindres

**[Español](#español) · [English](#english)**

---

## Español

Mods de Claude Code para trabajar mejor con Claude en growth, marketing y go-to-market. Un mod cambia **cómo trabajas con Claude**: ordena lo que le pides, te avisa antes de un error y te enseña lo que está haciendo. Ninguno exige saber programar.

### Los mods

| Mod | Qué hace | Coste |
|---|---|---|
| [Brief](plugins/brief/) | Convierte un mensaje largo y desordenado en un brief claro (objetivo, contexto, lo que necesitas, límites y preguntas) antes de que Claude lo lea, en tu idioma | Una llamada pequeña a Haiku, solo en mensajes de 100 palabras o más |

Vendrán más. Cada uno vive en su carpeta dentro de `plugins/`, con su README.

### Instalar

Añade la biblioteca una vez y después instala los mods que quieras.

**App de escritorio:** pulsa **+** junto al cuadro de texto → **Plugins** → **Add marketplace** con `gerardocolindresx/claude-mods` → elige el mod → **Add plugin**.

**En una sesión de Claude Code:**

```
/plugin marketplace add gerardocolindresx/claude-mods
/plugin install brief@claude-mods
```

**Desde la terminal:**

```
claude plugin marketplace add gerardocolindresx/claude-mods
claude plugin install brief@claude-mods
```

Abre una sesión nueva y el mod ya está activo. Para quitarlo: `/plugin`, pestaña **Installed**.

### Antes de instalar
Un mod corre dentro de Claude Code con tus permisos ([documentación oficial](https://code.claude.com/docs/en/plugins/mods/overview)). Instala solo de quien confíes y, si quieres, pide a Claude que lea el mod y te explique qué hace antes de instalarlo. Cada README de esta biblioteca dice qué toca y qué no.

---

## English

Claude Code mods for working with Claude in growth, marketing and go-to-market. A mod changes **how you work with Claude**: it tidies what you ask, warns you before a mistake, shows you what it is doing. None of them needs you to code.

### The mods

| Mod | What it does | Cost |
|---|---|---|
| [Brief](plugins/brief/) | Turns a long, messy message into a clear brief (goal, context, ask, constraints, open questions) before Claude reads it, in your own language | One small Haiku call, only for messages of 100+ words |

More to come. Each lives in its own folder under `plugins/`, with its own README.

### Install

Add the library once, then install the mods you want.

**Desktop app:** click **+** next to the prompt box → **Plugins** → **Add marketplace** with `gerardocolindresx/claude-mods` → pick the mod → **Add plugin**.

**In a Claude Code session:**

```
/plugin marketplace add gerardocolindresx/claude-mods
/plugin install brief@claude-mods
```

**From a shell:**

```
claude plugin marketplace add gerardocolindresx/claude-mods
claude plugin install brief@claude-mods
```

Open a new session and the mod is on. To remove it: `/plugin`, **Installed** tab.

### Before you install
A mod runs inside Claude Code with your permissions ([official docs](https://code.claude.com/docs/en/plugins/mods/overview)). Only install from people you trust, and ask Claude to read a mod and explain it before you install it if you like. Each README here says what the mod touches and what it doesn't.

---

MIT License · Gerardo Colindres
