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

async function getMaxPriorityFeePerGas(providerEndpoint) {
    const response = await fetch(providerEndpoint, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'jsonrpc': '2.0',
            'method': 'eth_maxPriorityFeePerGas',
            'params': [],
        })
    });
    const data = await response.json();
    return data.result;
}

async function getBaseFee(providerEndpoint) {
    const response = await fetch(providerEndpoint, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "eth_getBlockByNumber",
            "params": ["latest", false]
        })
    });
    const data = await response.json();
    return data.result ? data.result.baseFeePerGas : '0x0';
}