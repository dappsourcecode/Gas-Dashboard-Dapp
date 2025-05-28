async function getGasData(rpcUrl, chainName) {
    try {
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_gasPrice',
                params: [],
                id: 1,
            }),
        });
        const data = await response.json();
        const gasPriceWei = parseInt(data.result, 16);
        const gasPriceGwei = gasPriceWei / 1e9;
        const gasPriceNative = gasPriceWei / 1e18; // Assuming 18 decimals for ETH and similar chains
        console.log(`${chainName} Gas Price (Gwei):`, gasPriceGwei);
        // Update the corresponding HTML elements for this chain
        const baseFeeElementwei = document.getElementById(`${chainName.toLowerCase().replace(/\s+/g, '-')}-base-fee-wei`);
        const baseFeeElementGwei = document.getElementById(`${chainName.toLowerCase().replace(/\s+/g, '-')}-base-fee-gwei`);
        const baseFeeElementNative = document.getElementById(`${chainName.toLowerCase().replace(/\s+/g, '-')}-base-fee-native`);
        if (baseFeeElementwei) {
            baseFeeElementwei.textContent = gasPriceWei;
        }
        if (baseFeeElementGwei) {
            baseFeeElementGwei.textContent = gasPriceGwei;
        }
        if (baseFeeElementNative) {
            baseFeeElementNative.textContent = gasPriceNative;
        }

        // You would also fetch other relevant data like block number, etc.
        // Example for maxPriorityFeePerGas (if supported by the network):
        fetchMaxPriorityFeePerGas(rpcUrl, chainName);

    } catch (error) {
        console.error(`Error fetching gas data for ${chainName}:`, error);
        const baseFeeElementwei = document.getElementById(`${chainName.toLowerCase().replace(/\s+/g, '-')}-base-fee-gwei`);
        if (baseFeeElementwei) {
            baseFeeElementwei.textContent = `Error fetching gas data for ${chainName}:`, error;
        }
    }
}

async function fetchMaxPriorityFeePerGas(rpcUrl, chainName) {
    try {
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_maxPriorityFeePerGas',
                params: [],
                id: 2,
            }),
        });
        const data = await response.json();
        if (data.result) {
            const maxPriorityFeeWei = parseInt(data.result, 16);
            const maxPriorityFeeGwei = maxPriorityFeeWei / 1e9;
            const maxPriorityFeeNative = maxPriorityFeeWei / 1e18; // Assuming 18 decimals for ETH and similar chains
            console.log(`${chainName} Max Priority Fee (Gwei):`, maxPriorityFeeGwei);
            // Update relevant HTML elements
            const fastGasElementwei = document.getElementById(`${chainName.toLowerCase().replace(/\s+/g, '-')}-gas-fast-wei`);
            const fastGasElementGwei = document.getElementById(`${chainName.toLowerCase().replace(/\s+/g, '-')}-gas-fast-gwei`);
            const fastGasElementNative = document.getElementById(`${chainName.toLowerCase().replace(/\s+/g, '-')}-gas-fast-native`);
            if (fastGasElementwei) {
                fastGasElementwei.textContent = maxPriorityFeeWei;
            }
            if (fastGasElementGwei) {
                // A very basic estimation - you'd likely use a more sophisticated method
                fastGasElementGwei.textContent = (parseFloat(parseInt(await getBaseFee(rpcUrl), 16) / 1e9) + maxPriorityFeeGwei * 1.5);
            }
            if (fastGasElementNative) {
                fastGasElementNative.textContent = maxPriorityFeeNative;
            }
        }
    } catch (error) {
        console.warn(`Error fetching maxPriorityFeePerGas for ${chainName}:`, error);
        const fastGasElementwei = document.getElementById(`${chainName.toLowerCase().replace(/\s+/g, '-')}-gas-fast-wei`);
        if (fastGasElementwei) {
            fastGasElementwei.textContent = `Error fetching maxPriorityFeePerGas for ${chainName}:`, error;
        }
    }
}

async function getBaseFee(rpcUrl) {
    try {
        const response = await fetch(rpcUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBlockByNumber',
                params: ['latest', false],
                id: 3,
            }),
        });
        const data = await response.json();
        return data.result ? data.result.baseFeePerGas : '0x0';
    } catch (error) {
        console.error(`Error fetching latest block for ${chainName}:`, error);
        return '0x0';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Define RPC URLs for the chains you want to support
    const rpcUrls = {
        'Ethereum Mainnet': 'https://ethereum-mainnet.wallet.brave.com/', // e.g., Infura, Alchemy
        'Polygon Mainnet': 'https://polygon-mainnet.wallet.brave.com/',
        'Arbitrum One': 'https://arb1.arbitrum.io/rpc',
        'Optimism': 'https://optimism-mainnet.wallet.brave.com/',
        'Binance Smart Chain': 'https://bsc-mainnet.wallet.brave.com/',
        // Add more chains as needed
    };

    // Fetch gas data for each chain
    for (const chainName in rpcUrls) {
        getGasData(rpcUrls[chainName], chainName);
        // Optionally fetch other relevant data for each chain here
    }
});

// You might want to set up a periodic refresh for the data
// setInterval(() => {
//     for (const chainName in rpcUrls) {
//         getGasData(rpcUrls[chainName], chainName);
//         // Optionally refresh other data
//     }
// }, 15000);