//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ELO is Ownable {
    mapping(address => uint256) private elo;

    address private _masterContract;

    modifier onlyMaster() {
        require(
            _masterContract == msg.sender,
            "Function only for Core contract!"
        );
        _;
    }

    function changeMaster(address _newMaster) external onlyOwner {
        _masterContract = _newMaster;
    }

    function getElo(address _player) public view returns (uint256) {
        return elo[_player];
    }

    function setElo(address _player, uint256 _elo) external onlyMaster {
        elo[_player] = _elo;
    }

    function increaseElo(address _player, uint256 _elo) external onlyMaster {
        elo[_player] += _elo;
    }

    function decreaseElo(address _player, uint256 _elo) external onlyMaster {
        if (elo[_player] > _elo) {
            elo[_player] -= _elo;
        } else {
            elo[_player] = 0;
        }
    }
}
