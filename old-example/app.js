const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0jLod4pakQUQk9PDAhwr"));

/* if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0jLod4pakQUQk9PDAhwr"));
} */

//console.log(web3.eth.accounts.create());

function setEthTransaction({
	privKey,
	destinationAddress,
	spend,
	gas
}) {
	return web3.eth.accounts.signTransaction({
		to: destinationAddress,
		value: web3.utils.toWei(spend, 'ether'),
		gas: gas
	}, privKey);
}

async function main(from, to, contract) {
	try {
		/* const tx = await setEthTransaction({
			privKey: from.privKey,
			destinationAddress: to.address,
			spend: '0.005',
			gas: 60000
		});

		const txId = await web3.eth.sendSignedTransaction(tx.rawTransaction);

		console.log(txId); */
		const contractAbi = [
			{
				"constant": false,
				"inputs": [
					{
						"name": "from",
						"type": "address"
					},
					{
						"name": "to",
						"type": "address"
					},
					{
						"name": "tokens",
						"type": "uint256"
					}
				],
				"name": "transferFrom",
				"outputs": [
					{
						"name": "success",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": true,
				"inputs": [
					{
						"name": "tokenOwner",
						"type": "address"
					}
				],
				"name": "balanceOf",
				"outputs": [
					{
						"name": "balance",
						"type": "uint256"
					}
				],
				"payable": false,
				"stateMutability": "view",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "to",
						"type": "address"
					},
					{
						"name": "tokens",
						"type": "uint256"
					}
				],
				"name": "transfer",
				"outputs": [
					{
						"name": "success",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"constant": false,
				"inputs": [
					{
						"name": "spender",
						"type": "address"
					},
					{
						"name": "tokens",
						"type": "uint256"
					}
				],
				"name": "approve",
				"outputs": [
					{
						"name": "success",
						"type": "bool"
					}
				],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "function"
			}
		];

		const myContract = new web3.eth.Contract(
			contractAbi,
			contract.address
		);

		const result = await myContract.getPastEvents('allEvents');
		console.log(result);
		//const result = await myContract.methods.balanceOf(from.address).call();
		/* const data = myContract.methods.approve(to.address, web3.utils.toWei('1', 'ether')).encodeABI();
		const count = await web3.eth.getTransactionCount(from.address);
		const gasPrice = await web3.eth.getGasPrice();
		const gasLimit = 90000;
		const rawTx = {
			"nonce": web3.utils.toHex(count),
			"gasPrice": web3.utils.toHex(gasPrice),
			"gasLimit": web3.utils.toHex(gasLimit),
			"to": contract.address,
			"value": "0x00",
			"data": data,
			"chainId": 3
		};
		const tx = new Tx(rawTx);
		const  privateKey = Buffer.from(from.privKey.slice(2), 'hex');
		tx.sign(privateKey);
		//const serializedTx = tx.serialize();
		let serializedTx = "0x" + tx.serialize().toString('hex');
		console.log(serializedTx);
		const result = await web3.eth.sendSignedTransaction(serializedTx);
		console.log('result') ;
		console.log(result) ; */
	} catch (err) {
		console.log(err);
	}
}



main(accounts[0], accounts[3], contracts[0]);

//const txObj = web3.eth.sendSignedTransaction(tx.rawTransaction);



