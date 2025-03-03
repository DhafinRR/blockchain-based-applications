const FarmerRegistry = artifacts.require("FarmerRegistry");

module.exports = function (deployer) {
    deployer.deploy(FarmerRegistry);
};