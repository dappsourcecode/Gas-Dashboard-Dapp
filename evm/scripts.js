let gasPriceData = [];

async function generateGasPriceData() {
    try {
        for (const chainName in rpcUrls) {
            try {
                const theGasPrice = await getGasPrice(rpcUrls[chainName]);
                const theGasPriceWei = parseInt(theGasPrice, 16) ? parseInt(theGasPrice, 16) : 0;
                const themaxPriorityFeePerGas = await getMaxPriorityFeePerGas(rpcUrls[chainName]);
                const themaxPriorityFeePerGasWei = parseInt(themaxPriorityFeePerGas, 16) ? parseInt(themaxPriorityFeePerGas, 16) : 0;
                const theBaseFee = await getBaseFee(rpcUrls[chainName]);
                const theBaseFeeWei = parseInt(theBaseFee, 16) ? parseInt(theBaseFee, 16) : 0;
                gasPriceData.push({chainName : chainName, gasPriceWei : theGasPriceWei, maxPriorityFeePerGasWei : themaxPriorityFeePerGasWei, baseFeeWei : theBaseFeeWei});
            } catch (error) {
                console.error(`Error fetching gas price for ${chainName}: ${error}`);
                // Optionally, you can update the status message or log the error
                gasPriceData.push({chainName : error, gasPriceWei : 0});
                statusMessage.innerHTML += `Error fetching gas price for ${chainName}: ${error}<br>`;
            }
        }
        console.log('Gas price data generated:', gasPriceData);
    } catch (error) {
        statusMessage.innerHTML = 'Error sorting gas price data: '+ error;
    }  
}

refreshButton.addEventListener('click', async () => {
    gasPriceData = [];
    await generateGasPriceData();
    try {
        printGasPriceData(gasPriceData, selectedUnit);   
    } catch (error) {
        statusMessage.innerHTML = 'Error printing gas price data: '+ error;
    }
});

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
        printGasPriceData(gasPriceData, selectedUnit);
    } catch (error) {
        statusMessage.innerHTML = 'Error sorting gas price data: '+ error;
    }
}

let selectedUnit = units.value; // Default unit

units.addEventListener('change', (event) => {
    selectedUnit = event.target.value;
    printGasPriceData(gasPriceData, selectedUnit);
});

function printGasPriceData(gasPriceData, selectedUnit) {
    chainsContainer.innerHTML = ''; // Clear previous data
    const chainsHeader = document.createElement('tr');
    chainsHeader.className = 'chains-header';    
    chainsHeader.innerHTML = `
        <th>Chain Name</th>
        <th>Gas Price</th>
        <th>Max Priority Fee Per Gas</th>
        <th>Base Fee</th>
    `; // Add table headers
    chainsContainer.appendChild(chainsHeader); // Append header to the container
    let gasPrice;
    let maxPriorityFeePerGas
    let baseFee;

    gasPriceData.forEach(chain => {
        switch (selectedUnit) {
            case 'wei': gasPrice = chain.gasPriceWei; maxPriorityFeePerGas = chain.maxPriorityFeePerGasWei; baseFee = chain.baseFeeWei; break;
            case 'gwei': gasPrice = chain.gasPriceWei / 1e9; maxPriorityFeePerGas = chain.maxPriorityFeePerGasWei / 1e9; baseFee = chain.baseFeeWei / 1e9; break;
            case 'ether': gasPrice = chain.gasPriceWei / 1e18; maxPriorityFeePerGas = chain.maxPriorityFeePerGasWei / 1e18; baseFee = chain.baseFeeWei / 1e18; break;
            default: gasPrice = "undefined"; break;
        }
        const gasPriceRow = document.createElement('tr');
        gasPriceRow.innerHTML = `
            <td>${chain.chainName}</td>
            <td>${gasPrice}</td>
            <td>${maxPriorityFeePerGas}</td>
            <td>${baseFee}</td>
        `;
        chainsContainer.appendChild(gasPriceRow);
    });
}