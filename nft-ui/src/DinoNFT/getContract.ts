import Web3 from "web3";
import DinoNFTABI from "../contracts/DinoNFT.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const getContract = () => {
  const DinoNftAddress = "0xA7318e489D8F0a89F9FCC08DB5C2d129cc2ca174";
  const web3 = new Web3(window.ethereum);

  const DinoNftContract = new web3.eth.Contract(
    DinoNFTABI.abi as any[],
    DinoNftAddress
  );

  return {
    DinoNftAddress,
    DinoNftContract,
  };
};

export default getContract;
