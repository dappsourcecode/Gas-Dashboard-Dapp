let gasPriceData = [];
const sortBySelection = document.getElementById('sort-by-selection');
let sortBySelectionGasPrice = 'descending';
let sortBySelectionChainName = 'descending';

async function main() {
    try {
        for (const chainName in rpcUrls) {
            const theGasPrice = await getGasPrice(rpcUrls[chainName]);
            const theGasPriceWei = parseInt(theGasPrice, 16) ? parseInt(theGasPrice, 16) : 0;
            const theGasPriceGwei = theGasPriceWei / 1e9;
            const theGasPriceNative = theGasPriceWei / 1e18;
            gasPriceData.push({chainName : chainName, gasPriceWei : theGasPriceWei, gasPriceGwei: theGasPriceGwei, gasPriceNative: theGasPriceNative});
        }
        console.log('Gas Price Data:', gasPriceData);
        sortBySelection.style.display = 'block';
    } catch (error) {
        console.error('Error initializing gas data fetch:', error);
    }  
}

async function getGasPrice(providerEndpoint) {
    const response = await fetch(providerEndpoint, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'jsonrpc': '2.0',
            'method': 'eth_gasPrice',
            'params': [],
        })
    });
    const data = await response.json();
    return data.result;
}

async function sort(params) {
    if (params === 'ascending') {
        gasPriceData.sort((a, b) => a.gasPriceGwei - b.gasPriceGwei);
        console.log('Sorted Gas Price Data (Ascending):', gasPriceData);
    } else if (params === 'descending') {
        gasPriceData.sort((a, b) => b.gasPriceGwei - a.gasPriceGwei);
        console.log('Sorted Gas Price Data (Descending):', gasPriceData);
    } else {
        console.error('Invalid sort parameter:', params);
        return;
    }
}

sortBySelection.addEventListener('change', (event) => {
    if (event.target.value === 'gasPrice') {
        if (sortBySelectionGasPrice === 'descending') {
            sort('ascending');
            sortBySelectionGasPrice = 'ascending';
        } else {
            sort('descending');
            sortBySelectionGasPrice = 'descending';
        }
    }
    if (event.target.value === 'chainName') {
        if (sortBySelectionChainName === 'descending') {
            gasPriceData.sort((a, b) => a.chainName.localeCompare(b.chainName));
            sortBySelectionChainName = 'ascending';
        } else {
            gasPriceData.sort((a, b) => b.chainName.localeCompare(a.chainName));
            sortBySelectionChainName = 'descending';
        }
    }
    console.log('Sorted Gas Price Data:', gasPriceData);
});