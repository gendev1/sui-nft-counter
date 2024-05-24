import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { DEVNET_NFT_PACKAGE_ID } from "./constants";
export function MintNFT(props: { onMinted: (id: string) => void }) {
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  return (
    <div>
      <button
        onClick={() => {
          mintNFT();
        }}
      >
        Mint NFT
      </button>
    </div>
  );

  function mintNFT() {
    const txb = new TransactionBlock();
    txb.moveCall({
      arguments: [
        txb.pure("dragoon"),
        txb.pure("dragoon"),
        txb.pure("dragoon"),
      ],
      target: `${DEVNET_NFT_PACKAGE_ID}::devnet_nft::mint_to_sender`,
    });

    signAndExecute(
      {
        transactionBlock: txb,
        options: {
          // We need the effects to get the objectId of the created counter object
          showEffects: true,
        },
      },
      {
        onSuccess: (tx) => {
          suiClient
            .waitForTransactionBlock({
              digest: tx.digest,
            })
            .then(() => {
              const objectId = tx.effects?.created?.[0]?.reference?.objectId;
              if (objectId) {
                props.onMinted(objectId);
              }
            });
        },
      },
    );
  }
}
