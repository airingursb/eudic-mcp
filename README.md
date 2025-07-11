# Eudic MCP Server

A Model Context Protocol (MCP) server that provides tools for managing words in Eudic study lists.

## Features

- **save_word**: Save words to your Eudic study list with context and categorization

## Installation

### Using npx (recommended)

No installation required! Just use:

```bash
npx eudic-mcp
```

### Global installation

```bash
npm install -g eudic-mcp
```

### From source

1. Clone this repository:
```bash
git clone <repository-url>
cd eudic-mcp
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Link globally (optional):
```bash
npm link
```

## Configuration

The server requires your Eudic API authorization token to be set as an environment variable:

```bash
export EUDIC_AUTH_TOKEN="NIS your_token_here"
```

### Optional Configuration

You can also set these optional environment variables:

- `EUDIC_API_BASE_URL`: Base URL for Eudic API (default: `https://api.frdic.com`)
- `EUDIC_USER_AGENT`: User-Agent header for API requests (default: `Mozilla/5.0`)

### Example .env file

```bash
# Copy .env.example to .env and fill in your values
cp .env.example .env
```

## Usage

### Running the Server

Using npx:
```bash
EUDIC_AUTH_TOKEN="NIS your_token_here" npx eudic-mcp
```

Or if globally installed:
```bash
eudic-mcp
```

Or if installed from source:
```bash
npm run dev
```

### MCP Client Configuration

Add this to your MCP client configuration (e.g., Claude Desktop):

#### Using npx:
```json
{
  "mcpServers": {
    "eudic": {
      "command": "npx",
      "args": ["eudic-mcp"],
      "env": {
        "EUDIC_AUTH_TOKEN": "NIS your_token_here"
      }
    }
  }
}
```

#### Using global installation:
```json
{
  "mcpServers": {
    "eudic": {
      "command": "eudic-mcp",
      "env": {
        "EUDIC_AUTH_TOKEN": "NIS your_token_here"
      }
    }
  }
}
```

### Available Tools

#### save_word

Save a word to your Eudic study list.

**Parameters:**
- `word` (required): The word to save
- `language` (optional): Language of the word (default: "en")
- `star` (optional): Star rating for the word 1-5 (default: 2)
- `context_line` (optional): Context sentence containing the word
- `category_ids` (optional): List of category IDs for organizing the word (default: [0])

**Example:**
```json
{
  "word": "hello",
  "language": "en",
  "star": 3,
  "context_line": "Hello, how are you today?",
  "category_ids": [0, 1]
}
```

## Getting Your Authorization Token

1. Log in to your Eudic account
2. Navigate to API settings or developer section
3. Generate an API token
4. The token format should be: `NIS your_actual_token`

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## License

MIT License - see LICENSE file for details.