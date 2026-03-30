# Audience Rules Backend

Express API that stores audience targeting rules as JSON and evaluates them against a local audience list.

**Requirements:** Node.js 18+

## Run

```bash
npm install
npm start          # production
npm run dev        # watch mode (node --watch)
```

Default port is **3000**. Override with `PORT`:

```bash
PORT=4000 npm start
```

**CORS:** By default all origins are allowed. Set `CORS_ORIGIN` to a single origin string if you need to restrict (see `src/config/index.js`).

## Data

| File | Role |
|------|------|
| `data/audience-rules.json` | Persisted rules (read/write by the API) |
| `data/audiences.json` | Audience records used only by **POST /evaluate** |

## API overview

Base URL: `http://localhost:<PORT>` (replace with your host in production).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness check |
| `GET` | `/rules` | List all stored rules |
| `POST` | `/rules` | Create a rule |
| `DELETE` | `/rules/:id` | Delete a rule by UUID |
| `POST` | `/evaluate` | Run a rule tree against `audiences.json`; returns matching name + email |

Request bodies must be JSON (`Content-Type: application/json`). Max body size is 1 MB.

---

### `GET /health`

**Response:** `200` — `{ "ok": true }`

---

### `GET /rules`

Returns every rule as a JSON array. Each item includes server-generated fields.

**Response:** `200` — array of rule objects:

```json
{
  "id": "uuid",
  "name": "My campaign rule",
  "root": { "logic": "AND", "conditions": [], "groups": [] },
  "savedAt": "2026-03-30T12:00:00.000Z",
  "storedAt": "2026-03-30T12:00:00.000Z"
}
```

---

### `POST /rules`

Creates a rule and appends it to `data/audience-rules.json`.

**Body:**

| Field | Required | Type | Notes |
|-------|----------|------|--------|
| `name` | yes | string | Non-empty after trim |
| `root` | yes | object | Rule group (see [Rule tree](#rule-tree)) |
| `savedAt` | no | string | ISO timestamp; defaults to server time if omitted |

**Response:** `201` — the full saved record (includes new `id` and `storedAt`).

**Errors:** `400` if validation fails (message in JSON `{ "error": "..." }`).

---

### `DELETE /rules/:id`

**Path:** `id` must be a UUID.

**Response:**

- `204` — rule removed (no body)
- `404` — `{ "error": "Rule not found." }`

---

### `POST /evaluate`

Evaluates a rule **without** persisting it. Loads all rows from `data/audiences.json`, keeps those that satisfy `root`, and returns their `name` and `email`.

**Body:**

```json
{
  "root": {
    "logic": "AND",
    "conditions": [
      { "field": "country", "operator": "is", "value": "US" }
    ],
    "groups": []
  }
}
```

**Response:** `200`

```json
{
  "matches": [
    { "name": "Jane", "email": "jane@example.com" }
  ]
}
```

**Errors:** `400` if `root` is missing or invalid.

---

## Rule tree

Each **group** has:

- `logic`: `"AND"` or `"OR"`
- `conditions`: array of **condition** objects
- `groups`: nested groups (same shape), can be empty arrays

Each **condition** has string fields `field`, `operator`, and `value` (the evaluator compares using the types below).

### Supported fields and operators

| Field | Operators | `value` format |
|-------|-----------|----------------|
| `country` | `is`, `is not` | String compared to audience `country` |
| `plan` | `is`, `is not` | String compared to audience `plan` |
| `purchaseCount` | `equals`, `greater than`, `less than` | Numeric string (e.g. `"5"`) |
| `signupDate` | `on`, `before`, `after` | Date `YYYY-MM-DD` (UTC); compared to audience date in the same format |

Unknown field/operator pairs evaluate to false for that condition.

### Evaluation logic

- **AND:** all parts (conditions + nested groups) must pass; an empty group is treated as true for AND.
- **OR:** at least one part must pass.

---

## Errors

- **404** — unknown route: `{ "error": "Not found" }`
- **400** — invalid JSON body or rule payload (exposed message in `{ "error": "..." }` where applicable)
- **500** — unhandled server errors (handled by the global error middleware)
