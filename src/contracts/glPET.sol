// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.5.0
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreenLoopPet is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    constructor()
        ERC20("GreenLoop Pet", "glPET")
        Ownable(msg.sender)
        ERC20Permit("GreenLoop Pet")
    {}

    function mint(address to, uint256 amount)
        public
        onlyOwner
    {
        _mint(to, amount);
    }
}