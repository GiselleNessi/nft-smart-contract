'use client';

import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { defineChain, getContract, toEther } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { useEffect, useState } from "react";
import "./page.module.css"

export default function Home() {
  const account = useActiveAccount();

  const chain = defineChain(84532);

  const [quantity, setQuantity] = useState(1);

  const contract = getContract({
    client: client,
    chain: chain,
    address: "0x7E728534baDA44AD13FD69Cb1F4a630705792F4D"
  });

  const { data: contractMetadata, isLoading: isContractMetadataLoading } = useReadContract(getContractMetadata,
    { contract: contract }
  );

  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } = useReadContract(getTotalClaimedSupply,
    { contract: contract }
  );

  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract(nextTokenIdToMint,
    { contract: contract }
  );

  const { data: claimCondition } = useReadContract(getActiveClaimCondition,
    { contract: contract }
  );

  const getPrice = (quantity: number) => {
    const total = quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
    return toEther(BigInt(total));
  }

  useEffect(() => {
    console.log("Contract Metadata Image URL:", contractMetadata?.image);
  }, [contractMetadata?.image]);

  if (isContractMetadataLoading) {
    return <p>Loading contract metadata...</p>;
  }

  return (
    <main style={{ padding: "10px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "calc(100vw - 2rem)", margin: "auto" }}>
      <div style={{ paddingTop: "1rem", textAlign: "center" }}>
        <Header />
        <br />
        <ConnectButton
          client={client}
          chain={chain}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {isContractMetadataLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div style={{ marginTop: "10px" }}>
                <MediaRenderer
                  client={client}
                  src={contractMetadata?.image}
                  height={"200px"}

                />
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "2rem" }}>
                {contractMetadata?.name}
              </h2>
              <p style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
                {contractMetadata?.description}
              </p>
            </>
          )}
          {isClaimedSupplyLoading || isTotalSupplyLoading ? (
            <p>Loading...</p>
          ) : (
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "2rem" }}>
              Total NFT Supply: {claimedSupply?.toString()}/{totalNFTSupply?.toString()}
            </p>
          )}
          <br />
          <TransactionButton
            transaction={() => claimTo({
              contract: contract,
              to: account?.address || "",
              quantity: BigInt(quantity),
            })}
            onTransactionConfirmed={async () => {
              alert("NFT Claimed!");
              setQuantity(1);
            }}
          >
            {`Claim NFT (${getPrice(quantity)} ETH)`}
          </TransactionButton>
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "600", letterSpacing: "-0.025em", marginBottom: "1.5rem", color: "#f0f0f0" }}>
        Gigi NFT Free Collection
      </h1>
    </header>
  );
}