import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { COUNTER_PACKAGE_ID } from "./constants";
export function CreateCounter(props: { onCreated: (id: string) => void }) {
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  return (
    <div>
      <button
        onClick={() => {
          create();
        }}
      >
        Create Counter
      </button>
    </div>
  );

  function create() {
    const txb = new TransactionBlock();
    txb.moveCall({
      arguments: [],
      target: `${COUNTER_PACKAGE_ID}::counter::create`,
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
                props.onCreated(objectId);
              }
            });
        },
      },
    );
  }
}
