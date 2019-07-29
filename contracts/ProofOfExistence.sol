pragma solidity ^0.5.0;

contract ProofOfExistence {

  // address payable public owner;

  mapping (bytes32 => bool) private proofs;

  // constructor() public {
  //     owner = msg.sender;
  // }

  // store a proof of existence in the contract state
  function storeProof(bytes32 proof)
  internal
  {
    proofs[proof] = true;
  }

  // calculate and store the proof for a document
  function notarize(string calldata document)
  external
  {
    bytes32 proof = proofFor(document);
    storeProof(proof);
  }

  // helper function to get a document's sha256
  function proofFor(string memory document)
  public
  pure
  returns (bytes32)
  {
    return keccak256(bytes(document));
  }

  // verify if a document has been notarized
  function verify(string memory document)
  public
  view
  returns (bool)
  {
    bytes32 proof = proofFor(document);
    return hasProof(proof);
  }

  // returns true if proof is stored
  function hasProof(bytes32 proof)
  internal
  view
  returns(bool)
  {
    return proofs[proof];
  }
}