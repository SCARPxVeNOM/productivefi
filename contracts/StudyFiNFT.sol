// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StudyFiNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;
    
    // Mapping from creator address to their token count
    mapping(address => uint256) private _creatorTokenCounts;

    // Events
    event NFTMinted(address indexed creator, uint256 indexed tokenId, string tokenURI);
    event CreatorUpdated(uint256 indexed tokenId, address indexed creator);

    constructor() ERC721("StudyFi NFT", "STUDYFI") Ownable(msg.sender) {}

    function mint(address to, string memory tokenURI) public returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Set creator and update counts
        _creators[newTokenId] = msg.sender;
        _creatorTokenCounts[msg.sender]++;

        emit NFTMinted(msg.sender, newTokenId, tokenURI);
        return newTokenId;
    }

    function getCreator(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _creators[tokenId];
    }

    function getCreatorTokenCount(address creator) public view returns (uint256) {
        return _creatorTokenCounts[creator];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // Override _update to track transfers
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        address updated = super._update(to, tokenId, auth);
        
        // Update creator if this is the first transfer
        if (from == address(0) && _creators[tokenId] == address(0)) {
            _creators[tokenId] = to;
            emit CreatorUpdated(tokenId, to);
        }
        
        return updated;
    }
} 