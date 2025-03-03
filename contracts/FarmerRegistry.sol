// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmerRegistry {
    struct Farmer {
        string id;
        string name;
        string farmerAddress;
        bool isRegistered;
    }

    mapping(string => Farmer) public farmers;
    string[] public farmerIds;

    event FarmerRegistered(string id, string name, string farmerAddress);
    event FarmerUpdated(string id, string name, string farmerAddress);

    function registerFarmer(
        string memory _id,
        string memory _name,
        string memory _address
    ) public {
        require(bytes(_id).length > 0, "ID cannot be empty");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_address).length > 0, "Address cannot be empty");
        require(
            !farmers[_id].isRegistered,
            "Farmer with this ID already exists"
        );

        farmers[_id] = Farmer(_id, _name, _address, true);
        farmerIds.push(_id);
        emit FarmerRegistered(_id, _name, _address);
    }

    function updateFarmer(
        string memory _id,
        string memory _name,
        string memory _address
    ) public {
        require(farmers[_id].isRegistered, "Farmer does not exist");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_address).length > 0, "Address cannot be empty");

        farmers[_id].name = _name;
        farmers[_id].farmerAddress = _address;
        emit FarmerUpdated(_id, _name, _address);
    }

    function getFarmer(
        string memory _id
    ) public view returns (string memory, string memory, string memory) {
        require(farmers[_id].isRegistered, "Farmer does not exist");
        Farmer memory farmer = farmers[_id];
        return (farmer.id, farmer.name, farmer.farmerAddress);
    }

    function getFarmers() public view returns (Farmer[] memory) {
        Farmer[] memory _farmers = new Farmer[](farmerIds.length);
        for (uint i = 0; i < farmerIds.length; i++) {
            _farmers[i] = farmers[farmerIds[i]];
        }
        return _farmers;
    }

    function getFarmerCount() public view returns (uint256) {
        return farmerIds.length;
    }
}
