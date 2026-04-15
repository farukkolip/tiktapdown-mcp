# TikTapDown MCP Server

Give your AI assistant (Claude, Cursor, etc.) the power to download TikTok videos, find viral hashtags, get best posting times, and generate hook formulas — all in one MCP server.

**→ [tiktapdown.com](https://tiktapdown.com)**

## Tools

| Tool | What it does |
|---|---|
| `download_tiktok_video` | Download any TikTok video, returns no-watermark + watermark links |
| `get_tiktok_hashtags` | Top 15 hashtags for 15 niches + strategy tips |
| `get_best_time_to_post` | Best posting times for 12 countries with reasoning |
| `generate_tiktok_hook` | 8 hook categories × 3 formulas with examples |

## Quick Install — Claude Desktop

### Option 1: npx (no install needed)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tiktapdown": {
      "command": "npx",
      "args": ["-y", "tiktapdown-mcp"]
    }
  }
}
```

### Option 2: Local build

```bash
git clone https://github.com/YOUR_USERNAME/tiktapdown-mcp
cd tiktapdown-mcp
npm install && npm run build
```

Then add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tiktapdown": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/tiktapdown-mcp/dist/index.js"]
    }
  }
}
```

**Config file location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Restart Claude Desktop after editing the config.

## Example Prompts

Once installed, you can ask Claude:

- *"Download this TikTok for me: [url]"*
- *"What are the best hashtags for my fitness TikToks?"*
- *"When should I post on TikTok if my audience is in Turkey?"*
- *"Write me a curiosity hook for my finance content"*

## Supported Countries

US 🇺🇸 · GB 🇬🇧 · AU 🇦🇺 · CA 🇨🇦 · TR 🇹🇷 · DE 🇩🇪 · FR 🇫🇷 · BR 🇧🇷 · MX 🇲🇽 · JP 🇯🇵 · SA 🇸🇦 · AE 🇦🇪

## Supported Niches

Fitness · Beauty · Food · Travel · Tech · Education · Finance · Fashion · Lifestyle · Gaming · Motivation · Business · Pets · Music · Comedy

## License

MIT — [tiktapdown.com](https://tiktapdown.com)
