# Airtable Webhook for n8n

[![Author](https://img.shields.io/badge/Author-Daniel_Rudaev-000000?style=flat)](https://github.com/daniel-rudaev)
[![Studio](https://img.shields.io/badge/Studio-D1DX-000000?style=flat)](https://d1dx.com)
[![n8n](https://img.shields.io/badge/n8n-Community_Node-FF6D5A?style=flat&logo=n8n&logoColor=white)](https://www.npmjs.com/package/@d1dx/n8n-nodes-airtable)
[![Airtable](https://img.shields.io/badge/Airtable-Webhooks-18BFFF?style=flat&logo=airtable&logoColor=white)](https://airtable.com/developers/web/api/webhooks-overview)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](./LICENSE.md)

n8n community node that triggers workflows instantly when Airtable records change — using real [Airtable webhooks](https://airtable.com/developers/web/api/webhooks-overview), not polling.

Originally forked from [@vwork-digital/n8n-nodes-instant-airtable-trigger](https://www.npmjs.com/package/@vwork-digital/n8n-nodes-instant-airtable-trigger), fully rewritten by [D1DX](https://d1dx.com).

## How It Works

1. **Activate** a workflow with this trigger — registers an [Airtable webhook](https://airtable.com/developers/web/api/create-a-webhook) on your base
2. Airtable sends a notification ping to n8n on every matching change
3. The node fetches the [webhook payloads](https://airtable.com/developers/web/api/get-webhook-payloads) with cursor-based pagination
4. Payloads are parsed into flat per-record items with field names resolved
5. **Deactivate** the workflow — webhook is automatically deleted

**Important:** Airtable webhooks expire every 7 days. Use a separate scheduled workflow to [refresh them](https://airtable.com/developers/web/api/refresh-a-webhook).

## Installation

1. Go to **Settings > Community Nodes** in your n8n instance
2. Click **Install a community node**
3. Enter `@d1dx/n8n-nodes-airtable`
4. Click **Install**

Or via CLI:

```bash
cd ~/.n8n
npm install @d1dx/n8n-nodes-airtable
# Restart n8n
```

## Configuration

All field names map directly to the [Airtable Webhooks API specification](https://airtable.com/developers/web/api/model/webhooks-specification).

### Core Fields (always visible)

| Field | Airtable API | Description |
|-------|-------------|-------------|
| **Base** | — | Dropdown of all bases (via meta API) |
| **Table** | — | Dropdown of tables in selected base |
| **View** | `recordChangeScope` | Scope to a specific view. "Add" = entered view, "Remove" = left view. Form/List views not supported. Leave empty for entire table. |
| **Change Types** | `changeTypes` | Add / Update / Remove. Leave empty = all. Sent server-side to Airtable. |

### Shown when "Update" is selected

| Field | Airtable API | Description |
|-------|-------------|-------------|
| **Fields to Watch** | `watchDataInFieldIds` | Only trigger on changes to these fields. Leave empty = all fields. **Warning:** webhook permanently stops if a listed field is deleted. |
| **Include Previous Values** | `includePreviousCellValues` | Include the previous value alongside current for changed fields. |

### Output Options (always visible)

| Field | Airtable API | Description |
|-------|-------------|-------------|
| **Fields to Include in Output** | `includeCellValuesInFieldIds` | Always include these field values, even if unchanged. Select "All fields" to send `"all"` to API. Safe if a listed field is deleted. |
| **Use Field Names** | — | Resolve field IDs (e.g. `fldABC123`) to human names (e.g. `Status`) in output. |

### Advanced Options

| Field | Airtable API | Description |
|-------|-------------|-------------|
| **Data Types** | `dataTypes` | `tableData` (default), `tableFields`, `tableMetadata`. Can combine multiple. |
| **From Sources** | `fromSources` | Filter by source: `client`, `publicApi`, `automation`, `formSubmission`, `formPageSubmission`, `sync`, `system`, `anonymousUser`, `unknown`. Empty = all. |
| **Form Submission View ID** | `sourceOptions.formSubmission.viewId` | Filter form submissions to a specific form view. Only relevant when "Form Submission" is in From Sources. |
| **Form Page Submission Page ID** | `sourceOptions.formPageSubmission.pageId` | Filter interface page submissions to a specific page. Only relevant when "Form Page Submission" is in From Sources. |
| **Watch Field Schema Changes** | `watchSchemasOfFieldIds` | Only trigger on schema changes for these fields. Requires `tableFields` data type. **Warning:** webhook stops if field is deleted. |
| **Include Previous Field Definitions** | `includePreviousFieldDefinitions` | Include previous field name/type in field change payloads. Requires `tableFields` data type. |

## Credentials

You need an **Airtable Personal Access Token** (PAT):

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create a token with these scopes:
   - `webhook:manage` — register and delete webhooks
   - `data.records:read` — read webhook payloads
   - `schema.bases:read` — populate base/table/view/field dropdowns
3. Grant access to the bases you want to watch
4. In n8n, create an "Airtable API" credential and paste the token

## Output Format

One item per event. All items include `eventType`, `recordId`, `tableId`, `source`, `changedBy`, `timestamp`.

### Record events (`tableData`)

**Created:**
```json
{
  "eventType": "created",
  "recordId": "recXXXXXXXXXXXXXX",
  "tableId": "tblXXXXXXXXXXXXXX",
  "viewId": "viwXXXXXXXXXXXXXX",
  "createdTime": "2026-04-05T12:00:00.000Z",
  "fields": { "Status": "New", "Name": "Example" },
  "source": "client",
  "changedBy": { "userId": "usrXXXX", "userName": "John", "userEmail": "john@example.com" },
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

**Updated:**
```json
{
  "eventType": "updated",
  "recordId": "recXXXXXXXXXXXXXX",
  "tableId": "tblXXXXXXXXXXXXXX",
  "changedFields": ["Status"],
  "current": { "Status": "Done" },
  "previous": { "Status": "Active" },
  "unchanged": { "Name": "Example" },
  "source": "client",
  "changedBy": { "userId": "usrXXXX", "userName": "John", "userEmail": "john@example.com" },
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

**Deleted:**
```json
{
  "eventType": "deleted",
  "recordId": "recXXXXXXXXXXXXXX",
  "tableId": "tblXXXXXXXXXXXXXX",
  "source": "client",
  "timestamp": "2026-04-05T12:00:00.000Z"
}
```

### Field schema events (`tableFields`)

| eventType | Key fields |
|-----------|-----------|
| `fieldCreated` | `fieldId`, `name`, `type` |
| `fieldChanged` | `fieldId`, `current`, `previous` |
| `fieldDeleted` | `fieldId` |

### Table metadata events (`tableMetadata`)

| eventType | Key fields |
|-----------|-----------|
| `metadataChanged` | `current` (name, description), `previous` |

### Error events

| eventType | Key fields |
|-----------|-----------|
| `error` | `code`: `INVALID_FILTERS`, `INVALID_HOOK`, or `INTERNAL_ERROR` |

## Gotchas

- **View-scoped payloads have different structure.** When `recordChangeScope` is a view, Airtable nests records inside `changedViewsById` instead of directly on the table. The node handles this transparently.
- **10 webhooks per base.** Each active workflow uses one webhook. Plan accordingly.
- **Webhooks expire in 7 days.** Refresh them or they stop silently.
- **Field deletion kills the webhook.** If a field in `watchDataInFieldIds` or `watchSchemasOfFieldIds` is deleted, the webhook enters a permanent error state. Must deactivate and reactivate. Exception: `includeCellValuesInFieldIds` is safe — deleted fields are silently ignored.
- **Creator permissions required.** The PAT owner must have Creator access to register webhooks.
- **Community node updates require n8n restart.** n8n loads node code at startup, not dynamically.

## Credits

Originally created by [Jacob Vendramin](https://github.com/jvendramin) at [vwork Digital](https://vwork.digital) as `@vwork-digital/n8n-nodes-instant-airtable-trigger` (MIT license). Forked and rewritten by [D1DX](https://d1dx.com).

## License

MIT — see [LICENSE.md](LICENSE.md)

## Resources

- [Airtable Webhooks API](https://airtable.com/developers/web/api/webhooks-overview)
- [Airtable Create Webhook](https://airtable.com/developers/web/api/create-a-webhook)
- [Airtable Webhook Payloads](https://airtable.com/developers/web/api/get-webhook-payloads)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
