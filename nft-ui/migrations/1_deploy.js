const DinoNFT = artifacts.require("DinoNFT");

module.exports = function (deployer) {
  deployer.deploy(DinoNFT);
};
