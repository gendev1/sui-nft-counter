import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { isValidSuiObjectId } from "@mysten/sui.js/utils";
import { useState } from "react";
import { CreateCounter } from "./CreateCounter";
import { Counter } from "./Counter";
import { MintNFT } from "./MintNFT";

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });
  const [nftId, setNFTId] = useState("");

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>dApp Starter Template</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />

          <section>
            {!currentAccount ? (
              "Please connect your wallet"
            ) : counterId ? (
              <Counter id={counterId} />
            ) : (
              <CreateCounter
                onCreated={(id) => {
                  window.location.hash = id;
                  setCounter(id);
                }}
              />
            )}
          </section>

          <section>
            <p>NFT ID: {nftId}</p>
            <MintNFT onMinted={(id) => setNFTId(id)} />
          </section>
        </Container>
      </Container>
    </>
  );
}

export default App;
