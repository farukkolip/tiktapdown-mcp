# TikTapDown MCP Server

[![npm version](https://img.shields.io/npm/v/tiktapdown-mcp.svg)](https://www.npmjs.com/package/tiktapdown-mcp)
[![npm downloads](https://img.shields.io/npm/dm/tiktapdown-mcp.svg)](https://www.npmjs.com/package/tiktapdown-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-1.10+-blue.svg)](https://modelcontextprotocol.io/)
[![Glama Score](https://glama.ai/mcp/servers/farukkolip/tiktapdown-mcp/badges/score.svg)](https://glama.ai/mcp/servers/farukkolip/tiktapdown-mcp)

Give Claude, Cursor, Windsurf and any MCP-compatible AI assistant the power to **download TikTok videos**, find **viral hashtags by niche**, get **best posting times by country**, and generate **hook formulas** — all in one MCP server. Free, no API keys required.

**Companion web app → [tiktapdown.com](https://tiktapdown.com)**

## Why TikTapDown MCP?

If you're a TikTok creator, marketer, or social media agency using Claude or any MCP client, you can now:

- Pull a watermark-free MP4 of any TikTok directly into your AI conversation
- Get curated hashtag sets your AI can use when drafting captions
- Ask "when should I post in Germany?" and get a concrete answer
- Generate scroll-stopping opening lines without leaving Claude

No browser, no copy-paste, no third-party watermarks.

## Tools

| Tool | What it does |
|---|---|
| `download_tiktok_video` | Download any TikTok video. Returns no-watermark + watermark MP4 links. |
| `get_tiktok_hashtags` | Top 15 hashtags for 15 niches with strategy tips per niche. |
| `get_best_time_to_post` | Best posting windows for 12 countries with reasoning. |
| `generate_tiktok_hook` | 8 hook categories × 3 formulas with concrete examples. |

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
git clone https://github.com/farukkolip/tiktapdown-mcp
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

## Install — Cursor

Add to `~/.cursor/mcp.json`:

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

## Install — Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

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

## Example Prompts

Once installed, you can ask Claude:

- *"Download this TikTok for me: https://www.tiktok.com/@user/video/123"*
- *"What are the best hashtags for my fitness TikToks?"*
- *"When should I post on TikTok if my audience is in Germany?"*
- *"Write me a curiosity hook for my finance content"*
- *"Save this TikTok and write a caption with hashtags for fitness niche"*

## Supported Countries

US 🇺🇸 · GB 🇬🇧 · AU 🇦🇺 · CA 🇨🇦 · TR 🇹🇷 · DE 🇩🇪 · FR 🇫🇷 · BR 🇧🇷 · MX 🇲🇽 · JP 🇯🇵 · SA 🇸🇦 · AE 🇦🇪

## Supported Niches

Fitness · Beauty · Food · Travel · Tech · Education · Finance · Fashion · Lifestyle · Gaming · Motivation · Business · Pets · Music · Comedy

## Hook Categories

Curiosity · Contrarian · Listicle · How-To · Story · Question · Stat-Drop · Pattern-Interrupt

## Related

- **Web app**: [tiktapdown.com](https://tiktapdown.com) — same toolset in the browser
- **npm**: [npmjs.com/package/tiktapdown-mcp](https://www.npmjs.com/package/tiktapdown-mcp)
- **MCP spec**: [modelcontextprotocol.io](https://modelcontextprotocol.io)

## Part of the Tapdown family

TikTapDown is the first tool in a family of focused creator utilities, one platform at a time.

- 🎵 **TikTapDown** (TikTok) — live
- 📷 Instapdown (Instagram) — coming
- 🐦 XTapdown (X) — coming
- 📺 YouTapDown (YouTube) — coming
- 📌 PinTapdown (Pinterest) — coming

Each tool: simple, free, no fluff. Follow the build at [@tapdown_](https://x.com/tapdown_) on X or [u/tapdown_](https://www.reddit.com/user/tapdown_/) on Reddit.

## License

MIT — built by [farukkolip](https://github.com/farukkolip). Web companion: [tiktapdown.com](https://tiktapdown.com)
