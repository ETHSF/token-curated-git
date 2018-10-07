pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";

contract TokenCuratedGit is AragonApp {
    using SafeMath for uint256;

    /// Events
    event Approve(bytes32 indexed gitHash, bytes32 indexed data, address indexed sender);

    /// ACL
    bytes32 constant public APPROVER_ROLE = keccak256("APPROVER_ROLE");

    function initialize() onlyInit public {
        initialized();
    }

    /**
     * @notice Approve git commit `gitHash` with data `data`
     * @param gitHash The git commit hash
     * @param data Additional data, possibly a link
     */
    function approve(bytes32 gitHash, bytes32 data) auth(APPROVER_ROLE) external {
        emit Approve(gitHash, data, msg.sender);
    }
}
