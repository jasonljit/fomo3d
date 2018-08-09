const {
	ACCOUNTS,
	CONTRACTS
} = require('./db');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0jLod4pakQUQk9PDAhwr"));

main(ACCOUNTS[0], CONTRACTS[0], '0.005');

async function main(from, contract, spend) {
	try {
		const tx = await web3.eth.accounts.signTransaction(
			{
				to: contract.address,
				value: web3.utils.toWei(spend, 'ether'),
				gas: 90000
			},
			from.privKey
		);

		const result = await web3.eth.sendSignedTransaction(tx.rawTransaction)
			.on('transactionHash', function(txHash) {
				console.log('txHash: ' + txHash);
			});

		console.log(result);
	} catch(err) {
		console.log(err);
	}
}