# Simple ERC-20 Indexer

This is a simple react app that uses the Alchemy SDK rigged to Alchemy's Enhanced APIs in order to display all of an address's ERC-20 token balances.

## Set Up

1.  Install dependencies by running `npm install`
2.  Start application by running `npm run dev`
3.  Get your Alchemy API from [Alchemy](https://alchemy.com/?a=eth-bootcamp)
4.  Create a js file in the project directory called 'apikey.js'
5.  Paste this into the file:
    `

        const API = "<-- COPY-PASTE YOUR ALCHEMY API KEY HERE -->";
        export default API;

    `

6.  Run `npm run dev` to start the local development server.
