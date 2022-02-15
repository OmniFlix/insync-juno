const configs =
    JSON.parse(localStorage.getItem('chain-registry') || 'null') || [];

const globalConfigs = configs;

window.configs = configs;

const latestCommitPromise = fetch(
    `https://api.github.com/repos/cosmos/chain-registry/commits/master`,
)
    .then((r) => r.json())
    .then((r) => r.sha);

const fetchCached = async (url, options) => {
    const latestCommitHash = await latestCommitPromise;
    const cache = sessionStorage.getItem(latestCommitHash + url);
    if (cache) {
        return Promise.resolve(JSON.parse(cache));
    }
    return fetch(url, options)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then((json) => {
            sessionStorage.setItem(
                latestCommitHash + url,
                JSON.stringify(json),
            );
            return json;
        });
};
fetchCached('https://api.github.com/repos/cosmos/chain-registry/contents').then(
    async (data) => {
        const configs = [];
        for (const file of data) {
            try {
                if (file.name.startsWith('.') || file.type !== 'dir') {
                    continue;
                }
                const assetsConfig = await fetchCached(
                    `https://raw.githubusercontent.com/cosmos/chain-registry/master/${file.name}/assetlist.json`,
                );
                const chainConfig = await fetchCached(
                    `https://raw.githubusercontent.com/cosmos/chain-registry/master/${file.name}/chain.json`,
                );
                const stakingAsset = assetsConfig.assets[0];
                const sortApis = (apis, type) => {
                    const getValue = (api) => {
                        return (
                            api.address.includes('zenchainlabs') +
                            api.address.includes('.com') +
                            api.address.includes('.io')
                        );
                    };
                    const result = apis.sort((a, b) => {
                        return getValue(b) - getValue(a);
                    });

                    const isIPAddress = Number.isInteger(
                        +new URL(result[0].address).hostname.replaceAll(
                            '.',
                            '',
                        ),
                    );
                    if (result[0] && isIPAddress) {
                        result.unshift({
                            ...result[0],
                            address: `https://${type}-${chainConfig.chain_name.toLowerCase()}.keplr.app`,
                        });
                    }
                    return result;
                };
                const decimals = (
                    stakingAsset.denom_units.find(
                        (unit) => unit.denom === stakingAsset.display,
                    ) || {}
                ).exponent;
                const config = {
                    RPC_URL: sortApis([...chainConfig.apis.rpc], 'rpc')[0]
                        .address,
                    REST_URL: sortApis([...chainConfig.apis.rest], 'lcd')[0]
                        .address,
                    EXPLORER_URL: `https://www.mintscan.io/${chainConfig.chain_name}`,
                    NETWORK_NAME: chainConfig.pretty_name,
                    NETWORK_TYPE: 'mainnet',
                    CHAIN_ID: chainConfig.chain_id,
                    CHAIN_NAME: chainConfig.chain_name,
                    COIN_DENOM: stakingAsset.symbol,
                    COIN_MINIMAL_DENOM: stakingAsset.base,
                    COIN_DECIMALS: decimals === undefined ? 6 : decimals,
                    PREFIX: stakingAsset.display,
                    COIN_TYPE: 118,
                    COINGECKO_ID: 'juno-network',
                    DEFAULT_GAS: 250000,
                    GAS_PRICE_STEP_LOW: 0.005,
                    GAS_PRICE_STEP_AVERAGE: 0.025,
                    GAS_PRICE_STEP_HIGH: 0.08,
                    FEATURES: ['stargate', 'ibc-transfer'],
                };
                configs.push(config);
            } catch (e) {
                console.error(e);
            }
        }
        console.log(configs);
        // localStorage.setItem('chain', prompt('Enter chain name: ' + configs.map((c) => c.CHAIN_NAME).join(', ')));
        if (JSON.stringify(globalConfigs) !== JSON.stringify(configs)) {
            localStorage.setItem('chain-registry', JSON.stringify(configs));
            window.location.reload();
        }
    },
);

export const config = configs.find(
    (c) => c.NETWORK_NAME === localStorage.getItem('chain'),
) || {
    RPC_URL: 'https://rpc.juno.omniflix.co',
    REST_URL: 'https://api.juno.omniflix.co',
    EXPLORER_URL: 'https://www.mintscan.io/juno',
    STAKING_URL: 'https://juno.omniflix.co/stake',
    NETWORK_NAME: 'Juno',
    NETWORK_TYPE: 'mainnet',
    CHAIN_ID: 'juno-1',
    CHAIN_NAME: 'Juno',
    COIN_DENOM: 'JUNO',
    COIN_MINIMAL_DENOM: 'ujuno',
    COIN_DECIMALS: 6,
    PREFIX: 'juno',
    COIN_TYPE: 118,
    COINGECKO_ID: 'juno-network',
    DEFAULT_GAS: 200000,
    GAS_PRICE_STEP_LOW: 0.001,
    GAS_PRICE_STEP_AVERAGE: 0.0025,
    GAS_PRICE_STEP_HIGH: 0.004,
    FEATURES: ['stargate', 'ibc-transfer', 'cosmwasm', 'no-legacy-stdTx', 'ibc-go'],
};
