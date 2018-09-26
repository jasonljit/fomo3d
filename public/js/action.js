window.addEventListener('load', function() {
	new Clipboard('#copy');

	if (typeof web3 !== 'undefined') {
		web3 = new Web3(web3.currentProvider);
	} else {
		// web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/0jLod4pakQUQk9PDAhwr"));
	}

	web3.eth.defaultAccount = web3.eth.accounts[0];

	var contractAddress = '0x566766d130C978250Ec7eC420a558aD3B780827E';
	var playerAddress = web3.eth.defaultAccount;
	var fomo3dContract = web3.eth.contract(contractAbi);
	var fomo3d = fomo3dContract.at(contractAddress);

	var jqueryObj = {
		$playerId: $('#player-id'),
		$keyAmount: $('#key-amount'),
		$totalPrice: $('#total-price'),
		$onLockdown: $('#on-lockdown'),
		$exitScammed: $('#exit-scammed'),
		$badAdvice: $('#bad-advice'),
		$totalGains: $('#total-gains'),
		$referralURL: $('#referral-url'),
		$sendETH: $('#send-eth'),
		$affiliateAddress: $('#affiliate-address'),
		$withdraw: $('#withdraw'),
		$copy: $('#copy'),
	}

	setReferralURL(jqueryObj, playerAddress);
	getPlayerId(fomo3d, jqueryObj, playerAddress);
	getTotalPrice(fomo3d, jqueryObj);

	jqueryObj.$keyAmount.change(function() {
		getTotalPrice(fomo3d, jqueryObj);
	});

	jqueryObj.$sendETH.click(function() {
		var priceEther = jqueryObj.$totalPrice.val();
		var priceWei = web3.toWei(priceEther, 'ether');
		var transactionObject = {
			value: priceWei,
			gasPrice: web3.toWei('0.001', 'gwei'),
		};
		var team = $("input[name=team]:checked").val();
		var affiliateAddress = jqueryObj.$affiliateAddress.val();

		affiliateAddress = affiliateAddress === '' ? '0' : affiliateAddress;

		fomo3d.buyXaddr.sendTransaction(affiliateAddress, team, transactionObject, function(err, result) {
			if (err) {
				console.log(err);
			}

			console.log(result);
		});
	});

	jqueryObj.$withdraw.click(function() {
		fomo3d.withdraw(function(err, result) {
			if (err) {
				console.log(err);
			}

			console.log(result);
		});
	});

	jqueryObj.$copy.click(function() {
		jqueryObj.$copy.tooltip('enable');
		jqueryObj.$copy.tooltip('show');
		jqueryObj.$copy.tooltip('disable');
	});
});


function setReferralURL(jqueryObj, playerAddress) {
	var refferalURL = 'http://localhost:3333?referralAddr=' + playerAddress;

	jqueryObj.$referralURL.text(playerAddress);
}

function getPlayerId(fomo3d, jqueryObj, playerAddress) {
	fomo3d.pIDxAddr_(playerAddress, function(err, result) {
		var playerId = Number(result);

		jqueryObj.$playerId.val(playerId);

		getPlayerVaults(fomo3d, jqueryObj);
	})
}

function getTotalPrice(fomo3d, jqueryObj) {
	var keyAmountWei = web3.toWei(jqueryObj.$keyAmount.val(), 'ether');

	fomo3d.iWantXKeys(keyAmountWei, function(err, result) {
		if (err) {
			console.log(err);
		}

		var totalPrice = Number(result);

		displayTotalPrice(totalPrice, jqueryObj);
	});
}

function displayTotalPrice(totalPrice, jqueryObj) {
	jqueryObj.$totalPrice.val(web3.fromWei(totalPrice, 'ether'));
}

function getPlayerVaults(fomo3d, jqueryObj) {
	var playerId = jqueryObj.$playerId.val();

	fomo3d.getPlayerVaults(playerId, function(err, result) {
		var vaults = result.map(function(element) {
			return Number(element);
		});

		var total = vaults.reduce(function(accumulator, currentValue) {
			return accumulator + currentValue;
		});

		jqueryObj.$onLockdown.text(weiToEther(vaults[0]));
		jqueryObj.$exitScammed.text(weiToEther(vaults[1]));
		jqueryObj.$badAdvice.text(weiToEther(vaults[2]));
		jqueryObj.$totalGains.text(weiToEther(total));
	});
}

function weiToEther(value) {
	var valueInEther = web3.fromWei(value, 'ether');

	return parseFloat(valueInEther).toFixed(4);
}


var contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "roundID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amountAddedToPot",
				"type": "uint256"
			}
		],
		"name": "onPotSwapDeposit",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "activate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_affCode",
				"type": "address"
			},
			{
				"name": "_team",
				"type": "uint256"
			}
		],
		"name": "buyXaddr",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_affCode",
				"type": "uint256"
			},
			{
				"name": "_team",
				"type": "uint256"
			}
		],
		"name": "buyXid",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_affCode",
				"type": "bytes32"
			},
			{
				"name": "_team",
				"type": "uint256"
			}
		],
		"name": "buyXname",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "playerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "playerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "compressedData",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "compressedIDs",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "winnerAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "winnerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "amountWon",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "newPot",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "P3DAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "genAmount",
				"type": "uint256"
			}
		],
		"name": "onReLoadAndDistribute",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "playerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "playerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "ethIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "compressedData",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "compressedIDs",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "winnerAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "winnerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "amountWon",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "newPot",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "P3DAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "genAmount",
				"type": "uint256"
			}
		],
		"name": "onBuyAndDistribute",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "affiliateID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "affiliateAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "affiliateName",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"name": "roundID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"name": "buyerID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timeStamp",
				"type": "uint256"
			}
		],
		"name": "onAffiliatePayout",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "playerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "playerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "ethOut",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "compressedData",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "compressedIDs",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "winnerAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "winnerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "amountWon",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "newPot",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "P3DAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "genAmount",
				"type": "uint256"
			}
		],
		"name": "onWithdrawAndDistribute",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "compressedData",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "compressedIDs",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "playerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "playerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "ethIn",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "keysBought",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "winnerAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "winnerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "amountWon",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "newPot",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "P3DAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "genAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "potAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "airDropPot",
				"type": "uint256"
			}
		],
		"name": "onEndTx",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "playerID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"name": "playerAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "playerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "isNewPlayer",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "affiliateID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "affiliateAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "affiliateName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "amountPaid",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timeStamp",
				"type": "uint256"
			}
		],
		"name": "onNewName",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "playerID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "playerAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "playerName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "ethOut",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timeStamp",
				"type": "uint256"
			}
		],
		"name": "onWithdraw",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "potSwap",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_pID",
				"type": "uint256"
			},
			{
				"name": "_addr",
				"type": "address"
			},
			{
				"name": "_name",
				"type": "bytes32"
			},
			{
				"name": "_laff",
				"type": "uint256"
			}
		],
		"name": "receivePlayerInfo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_pID",
				"type": "uint256"
			},
			{
				"name": "_name",
				"type": "bytes32"
			}
		],
		"name": "receivePlayerNameList",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_nameString",
				"type": "string"
			},
			{
				"name": "_affCode",
				"type": "address"
			},
			{
				"name": "_all",
				"type": "bool"
			}
		],
		"name": "registerNameXaddr",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_nameString",
				"type": "string"
			},
			{
				"name": "_affCode",
				"type": "uint256"
			},
			{
				"name": "_all",
				"type": "bool"
			}
		],
		"name": "registerNameXID",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_nameString",
				"type": "string"
			},
			{
				"name": "_affCode",
				"type": "bytes32"
			},
			{
				"name": "_all",
				"type": "bool"
			}
		],
		"name": "registerNameXname",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_affCode",
				"type": "address"
			},
			{
				"name": "_team",
				"type": "uint256"
			},
			{
				"name": "_eth",
				"type": "uint256"
			}
		],
		"name": "reLoadXaddr",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_affCode",
				"type": "uint256"
			},
			{
				"name": "_team",
				"type": "uint256"
			},
			{
				"name": "_eth",
				"type": "uint256"
			}
		],
		"name": "reLoadXid",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_affCode",
				"type": "bytes32"
			},
			{
				"name": "_team",
				"type": "uint256"
			},
			{
				"name": "_eth",
				"type": "uint256"
			}
		],
		"name": "reLoadXname",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "activated_",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "airDropPot_",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "airDropTracker_",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_rID",
				"type": "uint256"
			},
			{
				"name": "_eth",
				"type": "uint256"
			}
		],
		"name": "calcKeysReceived",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "fees_",
		"outputs": [
			{
				"name": "gen",
				"type": "uint256"
			},
			{
				"name": "p3d",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBuyPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCurrentRoundInfo",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "bytes32"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getPlayerInfoByAddress",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bytes32"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_pID",
				"type": "uint256"
			}
		],
		"name": "getPlayerVaults",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTimeLeft",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_keys",
				"type": "uint256"
			}
		],
		"name": "iWantXKeys",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "pIDxAddr_",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "pIDxName_",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "plyr_",
		"outputs": [
			{
				"name": "addr",
				"type": "address"
			},
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "win",
				"type": "uint256"
			},
			{
				"name": "gen",
				"type": "uint256"
			},
			{
				"name": "aff",
				"type": "uint256"
			},
			{
				"name": "lrnd",
				"type": "uint256"
			},
			{
				"name": "laff",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "plyrNames_",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "plyrRnds_",
		"outputs": [
			{
				"name": "eth",
				"type": "uint256"
			},
			{
				"name": "keys",
				"type": "uint256"
			},
			{
				"name": "mask",
				"type": "uint256"
			},
			{
				"name": "ico",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "potSplit_",
		"outputs": [
			{
				"name": "gen",
				"type": "uint256"
			},
			{
				"name": "p3d",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "rID_",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rndTmEth_",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "round_",
		"outputs": [
			{
				"name": "plyr",
				"type": "uint256"
			},
			{
				"name": "team",
				"type": "uint256"
			},
			{
				"name": "end",
				"type": "uint256"
			},
			{
				"name": "ended",
				"type": "bool"
			},
			{
				"name": "strt",
				"type": "uint256"
			},
			{
				"name": "keys",
				"type": "uint256"
			},
			{
				"name": "eth",
				"type": "uint256"
			},
			{
				"name": "pot",
				"type": "uint256"
			},
			{
				"name": "mask",
				"type": "uint256"
			},
			{
				"name": "ico",
				"type": "uint256"
			},
			{
				"name": "icoGen",
				"type": "uint256"
			},
			{
				"name": "icoAvg",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];