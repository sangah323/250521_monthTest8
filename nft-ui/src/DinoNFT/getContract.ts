import Web3 from "web3";
import DinoNFTABI from "../contracts/DinoNFT.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const getContract = () => {
  const DinoNftAddress = "0x8210B77C529F9F36FE062Be6C35c977d116b221E";
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
