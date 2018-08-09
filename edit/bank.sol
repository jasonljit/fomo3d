pragma solidity ^0.4.24;

contract Bank {
    string public name = "bank";

    constructor()
        public
    {
        //constructor does nothing.
    }

    function()
        public
        payable
    {
        // do nothing
    }

    function deposit(address _addr)
        external
        payable
        returns (bool)
    {
        require(msg.value > 0, "Failed - zero deposits not allowed");
        return (true);
    }

    function migrationReceiver_setup()
        external
        returns (bool)
    {
        return (true);
    }
}