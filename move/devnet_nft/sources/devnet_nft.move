module devnet_nft::devnet_nft {
   
   use std::string::{String};
   use sui::event;


   /// An example NFT that can be minted by anybody
   public struct DevNetNFT has key, store {
       id: UID,
       /// Name for the token
       name: String,
       /// Description of the token
       description: String,
       /// URL for the token
       url: String,
       // TODO: allow custom attributes
   }


   // ===== Events =====


   public struct NFTMinted has copy, drop {
       // The Object ID of the NFT
       object_id: ID,
       // The creator of the NFT
       creator: address,
       // The name of the NFT
       name: String,
   }


   // ===== Public view functions =====


   /// Get the NFT's `name`
   public fun name(nft: &DevNetNFT): &String {
       &nft.name
   }


   /// Get the NFT's `description`
   public fun description(nft: &DevNetNFT): &String {
       &nft.description
   }


   /// Get the NFT's `url`
   public fun url(nft: &DevNetNFT): &String {
       &nft.url
   }


   // ===== Entrypoints =====


   #[allow(lint(self_transfer))]
   /// Create a new devnet_nft
   public fun mint_to_sender(
       name: String,
       description: String,
       url: String,
       ctx: &mut TxContext
   ) {
       let sender = tx_context::sender(ctx);
       let nft = DevNetNFT {
           id: object::new(ctx),
           name,
           description,
           url
       };


       event::emit(NFTMinted {
           object_id: object::id(&nft),
           creator: sender,
           name: nft.name,
       });


       transfer::public_transfer(nft, sender);
   }


   /// Transfer `nft` to `recipient`
   public fun transfer(
       nft: DevNetNFT, recipient: address, _: &mut TxContext
   ) {
       transfer::public_transfer(nft, recipient)
   }


   /// Update the `description` of `nft` to `new_description`
   public fun update_description(
       nft: &mut DevNetNFT,
       new_description: String,
       _: &mut TxContext
   ) {
       nft.description = new_description
   }


   /// Permanently delete `nft`
   public fun burn(nft: DevNetNFT, _: &mut TxContext) {
       let DevNetNFT { id, name: _, description: _, url: _ } = nft;
       object::delete(id)
   }
}

