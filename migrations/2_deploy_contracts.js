const RideRequest = artifacts.require("RideRequest");

module.exports = function(deployer) {
    deployer.deploy(RideRequest);
}