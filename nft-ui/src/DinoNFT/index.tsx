import { useState } from "react";
// import { useEffect, useState } from "react";
import getContract from "./getContract";
import Web3 from "web3";
import axios from "axios";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const web3 = new Web3(window.ethereum);

const DinoNFT = () => {
  const [account, setAccount] = useState("0x...");
  const [tokenId, setTokenId] = useState("");
  const [myNfts, setMyNfts] = useState<
    {
      tokenId: string;
      img: string;
      name: string;
      description: string;
    }[]
  >([]);
  const [allNfts, setAllNfts] = useState<
    {
      tokenId: string;
      owner: string;
      img: string;
      name: string;
      description: string;
    }[]
  >([]);

  const { DinoNftAddress, DinoNftContract } = getContract();

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const selectedAddress = accounts[0];
    setAccount(selectedAddress);
  };

  const minting = async () => {
    try {
      await DinoNftContract.methods.minting().send({
        from: account,
      });
      alert("NFT minting completed"); // NFT 민팅 완료
    } catch (error) {
      console.log(error);
    }
  };

  // 내가 소유하고 있는 NFT
  const myNFT = async () => {
    try {
      // 내가 발행한 총 NFT 발행량
      const myTokens = Number(
        await DinoNftContract.methods.totalSupply().call()
      );

      // NFT 정보들 배열로 담을거임
      const found: {
        tokenId: string;
        img: string;
        name: string;
        description: string;
      }[] = [];

      for (let id = 0; id < myTokens; id++) {
        try {
          // ownerOf(tokenID)로 NFT 소유자 주소 가져옴
          const owner = String(
            await DinoNftContract.methods.ownerOf(id).call()
          ); //0x301ca42b405e9470d8Bd5C44C0Cd1edDF8E6f673
          // console.log(account.toLowerCase()); // 0x301ca42b405e9470d8bd5c44c0cd1eddf8e6f673

          // NFT 소유자 주소(owner) = 내 주소(account)
          if (owner.toLowerCase() === account.toLowerCase()) {
            // tokenURI 가져옴
            const uri = String(
              await DinoNftContract.methods.tokenURI(id).call()
            ); // ipfs://bafybeiahvazhhdiivmpquw4kd363zlynl5soly45pte5dyzmqdnt5zcfw4/0.json

            const metadataURI = uri.replace("ipfs://", "https://ipfs.io/ipfs/"); // 'ipfs://' => 'https://ipfs.io/ipfs/'로 변경
            const { data } = await axios.get(metadataURI); // ipfs에 올린 Dinometadata NFT data 가져옴
            // {name: '렉스(Rex)', description: '쿨하고 자신감 넘치는 리더 타입', image: 'ipfs://bafybeia4tubek4ajekgfocxeiooyuho4kg2k2kfqbeb7zbvcloq6gea24i/0.png', attributes: Array(4)}

            const img = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
            const name = data.name;
            const description = data.description;
            found.push({ tokenId: id.toString(), img, name, description });
          }
        } catch (error) {
          console.log(error);
          continue;
        }
      }
      setMyNfts(found); // usestate 업데이트
    } catch (error) {
      console.log(error);
    }
  };

  // 모든 NFT
  const allNFT = async () => {
    try {
      // 내가 발행한 총 NFT 발행량
      const allTokens: string[] = await DinoNftContract.methods
        .allTokenIds()
        .call();

      // NFT 정보들 배열로 담을거임
      const allFound: {
        tokenId: string;
        owner: string;
        img: string;
        name: string;
        description: string;
      }[] = [];

      for (let i = 0; i < allTokens.length; i++) {
        const tokenId = allTokens[i];
        try {
          // NFT 소유자
          const owner = String(
            await DinoNftContract.methods.ownerOf(tokenId).call()
          );
          const uri = String(
            await DinoNftContract.methods.tokenURI(tokenId).call()
          );

          const metadataURI = uri.replace("ipfs://", "https://ipfs.io/ipfs/"); // 'ipfs://' => 'https://ipfs.io/ipfs/'로 변경
          const { data } = await axios.get(metadataURI); // ipfs에 올린 Dinometadata NFT data 가져옴

          const img = data.image.replace("ipfs://", "https://ipfs.io/ipfs/");
          const name = data.name;
          const description = data.description;
          allFound.push({
            tokenId: tokenId.toString(),
            owner,
            img,
            name,
            description,
          });
        } catch (error) {
          console.log(error);
          continue;
        }
      }
      setAllNfts(allFound);
    } catch (error) {
      console.log(error);
    }
  };

  // NFT 판매, 특정 NFT의 권한을 스마트컨트렉트에게 위임
  const sale = async (tokenId: string) => {
    try {
      // approve(to, tokenId), to(스마트컨트렉트) tokenId(권한 넘길 토큰 ID)
      await DinoNftContract.methods
        .approve(DinoNftAddress, tokenId)
        .send({ from: account });
      alert("Sale has been completed.");
    } catch (error) {
      console.log(error);
    }
  };

  // 모든 NFT 판매, 모든 NFT의 권한을 스마트컨트렉트에게 위임
  const allSale = async () => {
    try {
      // setApprovalForAll(operator, _approved), operator(스마트컨트렉트) _approved(위임 bool)
      await DinoNftContract.methods
        .setApprovalForAll(DinoNftAddress, true)
        .send({ from: account });
      alert("Sale has been completed.");
    } catch (error) {
      console.log(error);
    }
  };

  // NFT 구매
  const purchase = async (tokenId: string) => {
    try {
      const price = web3.utils.toWei("1", "ether");
      await DinoNftContract.methods
        .purchase(tokenId)
        .send({ from: account, value: price });
      alert("Your purchase has been completed.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>Dino NFT</h1>
      <div>
        <h4>WALLET CONNECT</h4>
        <button onClick={connectWallet}>Wallet Conncect</button>
        <p>{account !== "0x..." ? account : "Your wallet is not connected."}</p>
      </div>
      <div>
        <h4>MINTING</h4>
        <button onClick={minting}>NFT MINT</button>
      </div>
      <div>
        <h4>MY NFT</h4>
        <button
          onClick={() => {
            myNFT();
          }}
        >
          My NFT
        </button>
        <button onClick={allSale}>ALL SALE</button>
        {myNfts.length === 0 ? (
          <p>You do not own any NFTs.</p>
        ) : (
          myNfts.map((nft) => (
            <div key={nft.tokenId}>
              <img src={nft.img} alt={`NFT ${nft.tokenId}`} width={200} />
              <p>Token ID : {nft.tokenId}</p>
              <p>Name : {nft.name}</p>
              <p>Description : {nft.description}</p>
              <button
                onClick={() => {
                  sale(nft.tokenId);
                }}
              >
                SALE
              </button>
            </div>
          ))
        )}
      </div>
      <div>
        <h4>ALL NFT</h4>
        <button
          onClick={() => {
            allNFT();
          }}
        >
          All NFT
        </button>
        {allNfts.length === 0 ? (
          <p>No NFTs</p>
        ) : (
          allNfts.map((totalNft) => (
            <div key={totalNft.tokenId}>
              <img
                src={totalNft.img}
                alt={`nft ${totalNft.tokenId}`}
                width={200}
              />
              <p>Token ID : {totalNft.tokenId}</p>
              <p>Owner : {totalNft.owner}</p>
              <p>Name : {totalNft.name}</p>
              <p>Description : {totalNft.description}</p>
              {totalNft.owner.toLowerCase() !== account.toLowerCase() && (
                <button onClick={() => purchase(totalNft.tokenId)}>
                  PURCHASE
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DinoNFT;
