// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@limitbreak/creator-token-standards/src/access/OwnablePermissions.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OwnableInitializable
 * @dev This contract is not meant for use in Upgradeable Proxy contracts though it may base on Upgradeable contract. The purpose of this
 * contract is for use with EIP-1167 Minimal Proxies (Clones).
 */
abstract contract OwnableInitializable is OwnablePermissions, Ownable {
    error OwnableInitializable__OwnerAlreadyInitialized();

    bool private _ownerInitialized;

    /**
     * @dev Leave the default constructor as it's required by Ownable.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev When EIP-1167 is used to clone a contract that inherits Ownable permissions,
     * this is required to assign the initial contract owner, as the constructor is
     * not called during the cloning process.
     */
    function initializeOwner(address owner_) public {
        if (owner() != address(0) || _ownerInitialized) {
            revert OwnableInitializable__OwnerAlreadyInitialized();
        }

        _transferOwnership(owner_);
        _ownerInitialized = true;
    }

    function _requireCallerIsContractOwner() internal view virtual override {
        _checkOwner();
    }
}
