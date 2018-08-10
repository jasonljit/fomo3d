pragma solidity ^0.4.18;

contract LJC {
    string public symbol;
    string public  name;

	mapping(address => uint) balances;

    function LJC() public {
        symbol = 'LJC';
		name = 'Ljit Coin';
    }

	function transfer(address to, uint tokens) {
        balances[msg.sender] -= tokens;
        balances[to] += tokens;
    }

	function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }

	function () public payable {
		balances[msg.sender] += msg.value * 1000;
	}
}