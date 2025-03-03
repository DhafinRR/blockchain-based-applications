// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chop {
    struct Chopper {
        uint256 id_chop;
        string tanggal_chop;
        bool exists;
    }

    mapping(uint256 => Chopper) private choppers;
    uint256 private nextId;
    uint256[] private chopIds;

    event ChopAdded(uint256 indexed id_chop, string tanggal_chop);
    event ChopUpdated(uint256 indexed id_chop, string tanggal_chop);

    constructor() {
        nextId = 1;
    }

    modifier validDate(string memory _tanggal) {
        require(bytes(_tanggal).length > 0, "Tanggal Chop tidak boleh kosong");
        _;
    }

    modifier chopExists(uint256 _id) {
        require(choppers[_id].exists, "Chop tidak ditemukan");
        _;
    }

    function addChop(
        string memory _tanggal
    ) public validDate(_tanggal) returns (uint256) {
        uint256 currentId = nextId;

        choppers[currentId] = Chopper({
            id_chop: currentId,
            tanggal_chop: _tanggal,
            exists: true
        });

        chopIds.push(currentId);
        nextId++;

        emit ChopAdded(currentId, _tanggal);
        return currentId;
    }

    function updateChop(
        uint256 _id,
        string memory _tanggal
    ) public chopExists(_id) validDate(_tanggal) {
        choppers[_id].tanggal_chop = _tanggal;
        emit ChopUpdated(_id, _tanggal);
    }

    function getChop(
        uint256 _id
    ) public view chopExists(_id) returns (Chopper memory) {
        return choppers[_id];
    }

    function getAllChop() public view returns (Chopper[] memory) {
        uint256 activeCount = chopIds.length;
        Chopper[] memory allChops = new Chopper[](activeCount);

        for (uint256 i = 0; i < activeCount; i++) {
            allChops[i] = choppers[chopIds[i]];
        }

        return allChops;
    }

    function getCountChop() public view returns (uint256) {
        return chopIds.length;
    }

    function getNextId() public view returns (uint256) {
        return nextId;
    }

    // Additional helper functions
    function isValidChop(uint256 _id) public view returns (bool) {
        return choppers[_id].exists;
    }
}
