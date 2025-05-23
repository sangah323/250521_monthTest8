// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DinoNFT is ERC721 {
    using Strings for uint256;

    address public owner;
    uint256 private _totalSupply = 0; // 현재 발행된 NFT 수
    uint256[] private _allTokenIds; // 발생된 총 NFT tokenID 모음

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    // NFT 발행, Only owner, 사용자의 입력값 없이 totalSupply 기준 tokenID 순서대로 발행
    function minting() public {
        require(msg.sender == owner, "Only Owner"); // Only Owner
        require(_totalSupply < 4, "Mint limit reached"); // 4번만 민팅 가능

        uint256 newTokenId = _totalSupply;

        _mint(msg.sender, newTokenId); // msg.sender(owner)에게 tokenId 순서대로 민팅

        _allTokenIds.push(newTokenId); // 총 NFT 모음에 저장
        _totalSupply += 1; // tokenId 순서대로 민팅하기 위해 1 증가
    }

    // NFT 구매
    function purchase(uint256 tokenId) public payable {
        address currentOwner = ownerOf(tokenId); // 현재 NFT 소유자
        require(msg.sender != currentOwner, "You are already own this NFT"); // 소유자와 구매자가 같을 경우 방지

        // 해당 NFT에 대한 권한 위임을 받았는지 확인, address(this) => 스마트컨트렉트
        require(
            getApproved(tokenId) == address(this) ||
                isApprovedForAll(currentOwner, address(this)),
            "Not approved for transfer"
        );

        // 구매 가격 확인, 1이더
        require(msg.value == 1 ether, "Insufficient payment");

        // 현재 NFT 소유자에게 pay 지불
        payable(currentOwner).transfer(msg.value);

        // NFT 소유권을 currentOwner => msg.sender로 이동
        _transfer(currentOwner, msg.sender, tokenId);
    }

    // tokenURI
    function tokenURI(
        uint256 tokenId
    ) public pure override returns (string memory) {
        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string.concat(baseURI, tokenId.toString(), ".json")
                : "";
    }

    // baseURI, DinoMetaData
    function _baseURI() internal pure override returns (string memory) {
        return
            "ipfs://bafybeiahvazhhdiivmpquw4kd363zlynl5soly45pte5dyzmqdnt5zcfw4/";
    }

    // 사용자가 소유하고 있는 모든 NFT
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // 모든 사용자의 총 NFT(총 발급된 NFT), 배열로 반환
    function allTokenIds() public view returns (uint256[] memory) {
        return _allTokenIds;
    }
}
