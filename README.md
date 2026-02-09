# AI Chat Assistant — Take-Home Assessment

A Next.js chat application powered by Claude, with tool-use capabilities.

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the chat interface.

## Prerequisites

- Node.js 18+
- Python 3 (for the code analysis tool)
- An [Anthropic API key](https://console.anthropic.com/)

## Project Structure

```
app/
  page.tsx              # Chat UI (complete)
  layout.tsx            # Root layout
  api/chat/route.ts     # Chat API route
lib/
  tools/weather.ts      # Weather tool (TODO)
  tools/analyze.ts      # Code analysis tool (TODO)
  utils.ts              # Utility functions
components/ui/          # UI components
```

See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for assessment details.

## Implementation Details

### Weather Tool (`lib/tools/weather.ts`)
- **API Integration**: Uses Open-Meteo API[https://open-meteo.com/] to fetch forecast data.
- **Robust Error Handling**:
  - Handles non 200 API responses.
  - Catches network failures and JSON parsing errors.
  - Returns structured error objects to the LLM.

### Python Analysis Tool (`lib/tools/analyze.ts`)
- **Execution Method**: Uses 'python3 -c' for reliable execution of code strings.
- **Safety & Robustness**:
  - **Timeouts**: Enforces a 10 second timeout to prevent infinite loops (ETIMEDOUT).
  - **Large Output Support**: Configured with a 10MB 'maxBuffer' to handle extensive data analysis outputs.
  - **Environment Checks**: Explicitly checks for 'python3' availability (ENOENT) and returns clear error messages if missing.
  - **Error Capture**: Captures 'stderr' and returns it to the LLM for self-correction.
