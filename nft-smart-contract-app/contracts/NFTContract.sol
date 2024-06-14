// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Drop.sol";

contract MyNFT is ERC721Drop {
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC721Drop(
            _defaultAdmin,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps,
            _primarySaleRecipient
        )
    {}

    // Custom mint function
    function mintTo(address _to) public {
        require(balanceOf(_to) < 1, "Only 1 NFT per wallet allowed!");
        // nextTokenIdToMint function to get the next token ID
        uint256 tokenId = nextTokenIdToMint();
        _safeMint(_to, tokenId);
    }

    // Override tokenURI to customize URI logic
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return super.tokenURI(_tokenId);
    }
}
