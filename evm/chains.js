let rpcUrls = {
    'Ethereum Mainnet': 'https://ethereum-mainnet.wallet.brave.com/', // e.g., Infura, Alchemy
    'Polygon Mainnet': 'https://polygon-mainnet.wallet.brave.com/',
    'Arbitrum One': 'https://arb1.arbitrum.io/rpc',
    'Optimism': 'https://optimism-mainnet.wallet.brave.com/',
    'Binance Smart Chain': 'https://bsc-mainnet.wallet.brave.com/',
    // Add more chains as needed
};

/*
async function getRPCURLsFromJson(jsonUrl) {
    const thejsonUrl = jsonUrl;
    const response = await fetch(
        thejsonUrl
    );
    const RPCURLs = await response.json();
    return RPCURLs;
}

let RPCURLsFrom0fajarpurnama0GithubJson;

window.onload = async function() {
    RPCURLsFrom0fajarpurnama0GithubJson = await getRPCURLsFromJson('https://0fajarpurnama0.github.io/assets/json/evmrpc.json');
    rpcUrls = {}; // Initialize rpcUrls object
    for (const item in RPCURLsFrom0fajarpurnama0GithubJson) {
        for (const subitem in RPCURLsFrom0fajarpurnama0GithubJson[item]) {
            rpcUrls[RPCURLsFrom0fajarpurnama0GithubJson[item][subitem]['params'][0]['chainName']] = RPCURLsFrom0fajarpurnama0GithubJson[item][subitem]['params'][0]['rpcUrls'][0];
        }
    }
    console.log(rpcUrls);
}
*/