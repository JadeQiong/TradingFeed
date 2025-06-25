This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Introduction
Trading Feed - Takehome challenge (N1)
- A mock websocket server
- A table UI for realtime logs in Typescript + NextJS
- Corner Cases handled, simulated malformed data generated in mock server
- A Clear button that cleans the screen
- WS URL input verification
- TODO: Reconnect support, Annimations and visual effects, UI styling improvements

## How to run
1. ``` npm install ``` to install node_modules

### client

2. ``` npm run dev ```
### mock WS server

3. ``` cd mock-server```
4. ``` npx ts-node --compiler-options '{"module":"CommonJS"}' mock-server.ts ```
The demo page will be in  http://localhost:3000, WS Link: ws://localhost:8080
## How to build
```npx prettier --write .```

```npx next lint```

```npm run build```