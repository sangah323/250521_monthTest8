import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import dinoNFTABI from "../contracts/DinoNFT.json"

declare global {
  interface Window {
    ethereum?: any;
  }
}

const getContract = () => {
  const dinoNftAddress = '0x57f0D6e5C23d4a68C3061547cAfead1a37de711d';
  const web3 = new Web3(window.ethereum);

  const dinoNftContract = new web3.eth.Contract(
    dinoNFTABI.abi as AbiItem[],
    dinoNftAddress
  );

  return {
    dinoNftAddress,
    dinoNftContract,
  };
};

export default getContract;