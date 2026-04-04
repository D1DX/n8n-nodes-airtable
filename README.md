# Airtable Nodes for n8n

A collection of n8n community nodes for Airtable — filling gaps in n8n's built-in Airtable support.

## Nodes

### Instant Airtable Trigger

Triggers workflows instantly when Airtable records change — using real [Airtable webhooks](https://airtable.com/developers/web/api/webhooks-overview), not polling.

Based on [@vwork-digital/n8n-nodes-instant-airtable-trigger](https://www.npmjs.com/package/@vwork-digital/n8n-nodes-instant-airtable-trigger) by [Jacob Vendramin / vwork Digital](https://vwork.digital), with view filtering and improved UX.

**What's different from the original:**

- **View filtering** — scope the webhook to a specific Airtable view, so only changes to records visible in that view trigger the workflow. Use this to filter by user, status, or any view condition.
- **Clearer UI** — all fields have descriptive helper text explaining what they do, including how webhooks work under the hood.

*More nodes coming — this package is a home for any Airtable functionality missing from n8n's built-in nodes.*

## How it works

When you **activate** a workflow with this trigger node, it:

1. Registers an [Airtable webhook](https://airtable.com/developers/web/api/create-a-webhook) on your base via the API
2. Airtable sends a notification to n8n whenever a matching change happens
3. n8n fetches the [webhook payload](https://airtable.com/developers/web/api/get-webhook-payloads) with the actual change data
4. Your workflow runs with the changed record data

When you **deactivate** the workflow, the webhook is automatically deleted.

**Important:** Airtable webhooks expire every 7 days. You need a separate scheduled workflow to [refresh them](https://airtable.com/developers/web/api/refresh-a-webhook) — or they'll stop firing silently.

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

### Required fields

| Field | Description |
|-------|-------------|
| **Base** | The Airtable base to watch. All bases accessible by your API token are listed. |
| **Table** | The table to watch for changes. |

### Optional fields

| Field | Description |
|-------|-------------|
| **View** | Scope the webhook to a specific view. Only changes to records in this view trigger the workflow. Uses Airtable's [`recordChangeScope`](https://airtable.com/developers/web/api/model/webhooks-specification) with the view ID. Leave empty to watch all records. |
| **Fields to Watch** | Only trigger when these specific fields change. If empty, any field change triggers. Tip: add a "Refresh" checkbox field to trigger on demand. |
| **Extra Fields in Output** | Include these field values alongside the changed field — saves a separate API call to get record context. |
| **Include Previous Values** | Show what the field value was before the change. Useful for detecting transitions (e.g. status "Active" to "Done"). |
| **Event Types** | Record Created, Record Updated, Record Deleted. Most use cases only need "Updated". |

### Advanced options

| Option | Description |
|--------|-------------|
| **Change Types to Watch** | Record data (default), field schema changes, or table metadata changes. |
| **Filter by Change Source** | Only trigger for changes from specific sources: UI, API, automations, forms, sync, etc. |
| **Source Options (JSON)** | Filter form submissions by view ID or interface forms by page ID. |
| **Watch Field Schema Changes** | Trigger when specific fields are renamed, retyped, or have options modified. |

## Credentials

You need an **Airtable Personal Access Token** (PAT):

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create a token with these scopes:
   - `webhook:manage` — required to register and delete webhooks
   - `data.records:read` — required to read webhook payloads
   - `schema.bases:read` — required for the base/table/view/field dropdowns
3. Grant access to the bases you want to watch
4. In n8n, create an "Airtable API" credential and paste the token

## Output format

Each output item represents one field change on one record:

```json
{
  "recordId": "recXXXXXXXXXXXXXX",
  "fieldChanged": {
    "id": "fldXXXXXXXXXXXXXX"
  },
  "values": {
    "current": "New value",
    "previous": "Old value"
  },
  "includedData": [
    { "fieldId": "fldYYYY", "value": "Extra field value" }
  ],
  "changeType": "recordFieldValue",
  "tableId": "tblXXXXXXXXXXXXXX",
  "changedBy": {
    "userId": "usrXXXX",
    "userName": "John Doe",
    "userEmail": "john@example.com"
  },
  "timestamp": "2026-04-04T12:00:00.000Z"
}
```

## Limits and gotchas

- **10 webhooks per base** — Airtable enforces this. Each active workflow with this trigger uses one webhook. [Docs](https://airtable.com/developers/web/api/create-a-webhook)
- **Webhooks expire in 7 days** — refresh them with a scheduled workflow, or they stop silently
- **2 API calls per trigger** — listing webhooks + fetching payloads. Counts toward the 5 req/sec rate limit.
- **Creator permissions required** — the PAT owner must have Creator access to the base to register webhooks
- **View filtering is server-side** — Airtable only sends notifications for records in the view. If a record leaves the view (e.g. status changes), it counts as a "remove" event.

## Credits

Originally created by [Jacob Vendramin](https://github.com/jvendramin) at [vwork Digital](https://vwork.digital) as `@vwork-digital/n8n-nodes-instant-airtable-trigger` (MIT license).

Forked and enhanced by [D1DX](https://d1dx.com) with view filtering and improved documentation.

## License

MIT — see [LICENSE.md](LICENSE.md)

## Resources

- [Airtable Webhooks API](https://airtable.com/developers/web/api/webhooks-overview)
- [Airtable Webhook Specification](https://airtable.com/developers/web/api/model/webhooks-specification)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## Version history

### 1.0.0 (@d1dx/n8n-nodes-airtable)

- Initial release under D1DX scope
- **Instant Airtable Trigger:** add view selector — scope webhook to a specific view via `recordChangeScope`
- Rewrite all UI descriptions with clear helper text
- Rename "Additional Fields" to "Advanced Options"
- Add `getViews` loadOptions method
- Based on `@vwork-digital/n8n-nodes-instant-airtable-trigger` v1.0.2
