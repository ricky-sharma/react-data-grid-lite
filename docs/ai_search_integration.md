# 📘 AI-Powered Search in `DataGrid` Component

The `DataGrid` component supports **AI-powered search** using OpenAI, OpenRouter, or your custom backend/logic.

You can enable this by configuring the `options.aiSearch` object passed into the `DataGrid` as props.

---

## 🔧 Enabling AI Search

```jsx
<DataGrid
  id="my-grid"
  data={myData}
  columns={myColumns}
  options={{
    aiSearch: {
      enabled: true,
      apiKey: 'your-api-key', // Optional if using custom endpoint or logic
      model: 'openai/gpt-4' // or 'openai/gpt-3.5-turbo' — default is 'gpt-4'
      endpoint: 'https://openrouter.ai/api/v1/chat/completions', // Optional, only needed if not using OpenAI
      headers: {
        'HTTP-Referer': 'https://yourdomain.com', // Required for OpenRouter
        'X-Title': 'My AI Grid'
      },
      systemPrompt: 'You are a helpful assistant.',
      minRowCount: 50, // Minimum number of rows to trigger AI search
    }
  }}
/>
```

---

## 🧠 Default AI Behavior

The `DataGrid` uses the following **default system prompt** for AI queries:

```text
You are a filtering assistant. Given a list of JSON rows, return only the rows matching the query. Only return a JSON array of matched rows.
```

### 🛠 Customizing the Prompt

You can override it using:

```js
aiSearch: {
  systemPrompt: 'You are a helpful assistant that...'
}
```

⚠️ You must still ensure the AI output is a **pure JSON array** of rows, otherwise it will be rejected.

---

## 🚀 How It Works

When **global search** is used:

* If `aiSearch.enabled` is `true`, and:

  * the search is global,
  * the dataset exceeds `minRowCount`,
  * and a query is entered,

→ The `DataGrid` will attempt to use the configured AI service to find matching rows from your data.

If AI search fails (e.g., invalid key, timeout), the DataGrid **automatically falls back** to local search.

---

## ✅ AI Search Modes

There are **3 different modes** you can configure based on your needs:

---

### 1. **OpenAI / OpenRouter (Standard API Key)**

#### Use when:

* You have an API key from [OpenAI](https://platform.openai.com/) or [OpenRouter](https://openrouter.ai).

#### Example:

```js
aiSearch: {
  enabled: true,
  apiKey: 'sk-xxxxxx',
  model: 'gpt-4',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  headers: {
    'HTTP-Referer': 'https://yourdomain.com',
    'X-Title': 'Grid AI Search'
  },
  systemPrompt: 'You are an AI assistant that filters data.',
  minRowCount: 100
}
```

> 🔒 **Note for OpenRouter**: `HTTP-Referer` header is required for browser-based clients.

---

### 2. **Custom Backend Endpoint (No API Key)**

#### Use when:

* You want to process the AI logic server-side (e.g., with rate-limiting, prompt tuning, caching, etc.).
* No API key is provided.

#### Example:

```js
aiSearch: {
  enabled: true,
  endpoint: 'https://my-backend.com/api/ai-search',
  headers: {
    Authorization: 'Bearer my-secret-token'
  },
  minRowCount: 100
}
```

#### Expected API Contract:

Your endpoint must accept:

```json
{
  "query": "Search string",
  "data": [ ...your full grid data... ]
}
```

And return:

```json
[ { /* matching row 1 */ }, { /* matching row 2 */ } ]
```

---

### 3. **Custom AI Search Function**

#### Use when:

* You want **full control** over AI logic (e.g., vector search, chaining, RAG).

#### Example:

```js
aiSearch: {
  enabled: true,
  runAISearch: async ({ query, data }) => {
    const results = await myCustomAISearch(query, data);
    return results; // Must return a JSON array of matching rows
  },
  minRowCount: 100
}
```

> This bypasses the built-in `useAISearch` logic entirely and uses your own function.

---

## 🔍 Local vs AI Search in React DataGrid Lite

| Feature                 | Local Search | AI Search                 |
| ----------------------- | ------------ | ------------------------- |
| Column search input field| ✅            | ❌ (Global search input field only, in grid Toolbar)           |
| Global natural language | ❌            | ✅                         |
| Fuzzy matching          | ❌            | ✅ (via AI model)          |
| Multi-column filtering  | ✅            | ✅ (if described in query) |
| Custom search logic     | ❌            | ✅ (`runAISearch`)         |

---

## 🛠 Available `aiSearch` Options

| Option         | Type       | Description                                          |
| -------------- | ---------- | ---------------------------------------------------- |
| `enabled`      | `boolean`  | Enable/disable AI search                             |
| `apiKey`       | `string`   | API key for OpenAI/OpenRouter                        |
| `model`        | `string`   | Model ID (e.g., `gpt-4`)                             |
| `endpoint`     | `string`   | API endpoint (optional)                              |
| `headers`      | `object`   | Custom headers (e.g., OpenRouter headers)            |
| `systemPrompt` | `string`   | (Optional) Custom AI system prompt                   |
| `minRowCount`  | `number`   | Min rows before using AI (default: `1`)              |
| `runAISearch`  | `function` | Custom AI search function (overrides built-in logic) |

---

## 🧪 Example Use Case

**You want to enable AI search only when there are 100+ rows** and fallback to local otherwise:

```js
aiSearch: {
  enabled: true,
  apiKey: 'sk-...',
  model: 'gpt-3.5-turbo',
  minRowCount: 100
}
```

## 🧪 Example with OpenRouter

```js
aiSearch: {
  enabled: true,
  apiKey: 'your-openrouter-api-key',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'mistral/mixtral-8x7b',
  headers: {
    'HTTP-Referer': 'https://mygrid.com',
    'X-Title': 'My Grid AI'
  },
  minRowCount: 50
}
```

---

## 🛠 Troubleshooting

| Issue                      | Solution                                                        |
| -------------------------- | --------------------------------------------------------------- |
| No API key provided        | Use `endpoint` or `runAISearch`, or supply a valid `apiKey`.    |
| AI response not valid JSON | Ensure your prompt tells the AI to return *only a JSON array*.  |
| 403 from OpenRouter        | Add `HTTP-Referer` and `X-Title` headers in `headers`.          |
| Empty results from AI      | Test prompt and input manually; possibly refine `systemPrompt`. |