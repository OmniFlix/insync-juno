inSync by OmniFlix (for Communities)
===

inSync is a collaborative interface for an entire community (or) blockchain network to:
- identify stakeholders such as validator node hosts (will expand to other types of node hosts depending on the network)
- discover proposals
& more!

Currently, the aim of inSync is to be the default/defacto interface when bootstrapping community activities of a specific chain (on testnet or mainnet).

# Requirements
 yarn

# Instructions 
  1. clone repository and install packages
  ```sh
  git clone https://github.dev/OmniFlix/insync.git
  cd insync
  yarn
  ```

 2. update chain config
  
  `NOTE:` below is the chain config for juno mainnet
 
 `src/config.js`
 ```js
export const config = {
    RPC_URL: 'https://rpc.juno.omniflix.co',
    REST_URL: 'https://api.juno.omniflix.co',
    EXPLORER_URL: 'https://www.mintscan.io/juno',
    NETWORK_NAME: 'Juno',
    NETWORK_TYPE: 'mainnet',
    CHAIN_ID: 'juno-1',
    CHAIN_NAME: 'Juno Mainnet',
    COIN_DENOM: 'JUNO',
    COIN_MINIMAL_DENOM: 'ujuno',
    COIN_DECIMALS: 6,
    PREFIX: 'juno',
    COIN_TYPE: 118,
    GAS_PRICE_STEP_LOW: 0.005,
    GAS_PRICE_STEP_AVERAGE: 0.025,
    GAS_PRICE_STEP_HIGH: 0.04,
};
 ```

 3. start app
 ```sh
 yarn start
 ```
