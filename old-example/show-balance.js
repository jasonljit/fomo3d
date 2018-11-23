const {
	ACCOUNTS,
	CONTRACTS
} = require('./db');

const fs = require('fs');
const Tx = require('ethereumjs-tx');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0jLod4pakQUQk9PDAhwr"));

main(ACCOUNTS[0], CONTRACTS[0]);

async function main(from, contract) {
	try {
		const contractAbiJson = fs.readFileSync('./jst-abi.json');
		const contractAbi = JSON.parse(contractAbiJson);

		const myContract = new web3.eth.Contract(
			contractAbi,
			contract.address
		);

		const result = await myContract.methods.balanceOf(from.address).call();

		console.log(from.address + ' has ' + web3.utils.fromWei(result, 'ether') + ' JST');
	} catch(err) {
		console.log(err);
	}
}
