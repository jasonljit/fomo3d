const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/fDJ76DQ1EQat5T7SoO3O'));
const Tx = require('ethereumjs-tx');

const from = '0x1d52E9887F403Fc1Ca6e09D1a9286ea5B3b70899';
const to = '0x34E9A5521aC519fB123b27b73e837ad5f2d7B75C';
const amount = '0.001';
const fromPrivKey = '0x5bc3fb87d5c56bc7fa5cbf9383fb7d25982b86bbf99ff8e5e3d2d5236406893b';

async function main() {
	try {

		const tx = await setEthTransaction({
			privKey: fromPrivKey,
			to,
			amount,
			gas: 100000
		});

		const result = await broadcastEthTransaction(tx);

		console.log('result: ', result);
	} catch (err) {
		console.log(err);
	}
}

main();


async function setEthTransaction(args) {
	try {
		const {
			privKey,
			to,
			amount,
			gas
		} = args;
		const ethereumUnit = 10 ** 18;
		return await web3.eth.accounts.signTransaction({
			to: to,
			value: web3.utils.toWei(amount, 'ether'),
			gas: gas
		}, privKey);
	} catch (err) {
		console.log(err);
	}
}

async function broadcastEthTransaction(tx) {
	try {
		return await web3.eth.sendSignedTransaction(tx.rawTransaction)
			.on('transactionHash', function (hash) {
				console.log('got hash');
				console.log('hash: ', hash);
			});
	} catch (err) {
		console.log(err);
	}
}

