const {
	ACCOUNTS,
	CONTRACTS
} = require('./db');

const fs = require('fs');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0jLod4pakQUQk9PDAhwr"));

main(ACCOUNTS[2], ACCOUNTS[0], CONTRACTS[0]);

async function main(from, to, contract) {
	try {
		const contractAbiJson = fs.readFileSync('./jst-abi.json');
		const contractAbi = JSON.parse(contractAbiJson);

		const myContract = new web3.eth.Contract(
			contractAbi,
			contract.address
		);

		const data = myContract.methods.transfer(to.address, 1).encodeABI();
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

		const serializedTx = "0x" + tx.serialize().toString('hex');
		const result = await web3.eth.sendSignedTransaction(serializedTx)
			.on('transactionHash', function(txHash) {
				console.log('txHash: ' + txHash);
			});

		console.log(result);
	} catch(err) {
		console.log(err);
	}
}
