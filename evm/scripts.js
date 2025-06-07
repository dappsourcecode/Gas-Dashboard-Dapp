let gasPriceData = [];
const sortByCategory = document.getElementById('sort-by-category');
const sortByFrom = document.getElementById('sort-by-from');
const chainsContainer = document.getElementById('chains-container');
const refreshButton = document.getElementById('refresh-button');
const statusMessage = document.getElementById('status-message');

async function generateGasPriceData() {
    try {
        for (const chainName in rpcUrls) {
            const theGasPrice = await getGasPrice(rpcUrls[chainName]);
            const theGasPriceWei = parseInt(theGasPrice, 16) ? parseInt(theGasPrice, 16) : 0;
            const theGasPriceGwei = theGasPriceWei / 1e9;
            const theGasPriceNative = theGasPriceWei / 1e18;
            gasPriceData.push({chainName : chainName, gasPriceWei : theGasPriceWei, gasPriceGwei: theGasPriceGwei, gasPriceNative: theGasPriceNative});
        }
        sortByCategory.style.display = 'block';
    } catch (error) {
        statusMessage.innerHTML = 'Error sorting gas price data: '+ error;
    }  
}

refreshButton.addEventListener('click', async () => {
    gasPriceData = [];
    await generateGasPriceData();
    try {
        printGasPriceData(gasPriceData);   
    } catch (error) {
        statusMessage.innerHTML = 'Error printing gas price data: '+ error;
    }
});

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

let categoryValue = 'gasPrice';
let fromValue = 'ascending';

sortByCategory.addEventListener('change', (event) => {
    categoryValue = event.target.value;
    sort(categoryValue, fromValue);
});

sortByFrom.addEventListener('change', (event) => {
    fromValue = event.target.value;
    sort(categoryValue, fromValue);
});

async function sort(category, from) {
    try {
        if (category === 'gasPrice') {
            gasPriceData.sort((a, b) => {
                return from === 'ascending' ? a.gasPriceWei - b.gasPriceWei : b.gasPriceWei - a.gasPriceWei;
            });
        } else if (category === 'chainName') {
            gasPriceData.sort((a, b) => {
                return from === 'ascending' ? a.chainName.localeCompare(b.chainName) : b.chainName.localeCompare(a.chainName);
            });
        }
        printGasPriceData(gasPriceData);
    } catch (error) {
        statusMessage.innerHTML = 'Error sorting gas price data: '+ error;
    }
}

function printGasPriceData(gasPriceData) {
    chainsContainer.innerHTML = ''; // Clear previous data
    const chainsHeader = document.createElement('tr');
    chainsHeader.className = 'chains-header';    
    chainsHeader.innerHTML = `
        <th>Chain Name</th>
        <th>Gas Price (Wei)</th>
        <th>Gas Price (Gwei)</th>
        <th>Gas Price (Native)</th>
    `; // Add table headers
    chainsContainer.appendChild(chainsHeader); // Append header to the container
    gasPriceData.forEach(chain => {
        const gasPriceRow = document.createElement('tr');
        gasPriceRow.innerHTML = `
            <td>${chain.chainName}</td>
            <td>${chain.gasPriceWei} wei</td>
            <td>${chain.gasPriceGwei} Gwei</td>
            <td>${chain.gasPriceNative} Native</td>
        `;
        chainsContainer.appendChild(gasPriceRow);
    });
}