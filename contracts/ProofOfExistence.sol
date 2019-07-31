pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';


/// @title A contract to store proof of documents and verify their existence
/// @author John H. Yu
/// @notice This is an assignment from ConsenSys Academy Blockchain Developer Bootcamp Spring 2019 course
/// @dev Proof can be calculated offline to save gas
contract ProofOfExistence is Ownable {

  /**
    * @dev Emitted when the pause is triggered by a pauser (`account`).
    */
  event Paused(address account);

  /**
    * @dev Emitted when the pause is lifted by a pauser (`account`).
    */
  event Unpaused(address account);

  event Notarized(address indexed owner, bytes32 indexed proof, uint time,
  string name, bytes32 tags, uint size, bytes32 contentType);

  bool private _paused;

  /// @notice Fetch details related to a proof/hash
  /// @dev hash size is fixed to bytes32
  /// @param rings The number of rings from dendrochronological sample
  /// @return age in years, rounded up for partial years
  struct DocInfo {
    string name;
    bytes32 tags;
    uint time;
    uint size;
    bytes32 contentType;
    address creator;
  }
  // mapping (bytes32 => bool) public proofs;

  mapping (bytes32 => DocInfo) public proofDocInfo;

  mapping (address => bytes32[]) public acountProofs;

  constructor () public {
      _paused = false;
  }

  /**
    * @dev Returns true if the contract is paused, and false otherwise.
    */
  function paused() public view returns (bool) {
      return _paused;
  }

  /**
    * @dev Modifier to make a function callable only when the contract is not paused.
    */
  modifier whenNotPaused() {
      require(!_paused, "Pausable: paused");
      _;
  }

  /**
    * @dev Modifier to make a function callable only when the contract is paused.
    */
  modifier whenPaused() {
      require(_paused, "Pausable: not paused");
      _;
  }

  /**
    * @dev Called by owner to pause, triggers stopped state.
    */
  function pause() public onlyOwner whenNotPaused {
      _paused = true;
      emit Paused(msg.sender);
  }

  /**
    * @dev Called by owner to unpause, returns to normal state.
    */
  function unpause() public onlyOwner whenPaused {
      _paused = false;
      emit Unpaused(msg.sender);
  }

  // store a proof of existence in the contract state
  /// @notice store a proof/hash
  /// @dev hash size is fixed to bytes32
  /// @param proof The bytes32 hash
  // function storeProof(bytes32 proof)
  // internal
  // {
  //   proofs[proof] = true;
  // }

  // calculate and store the proof for a document
  /// @notice Notarize data of a document
  /// @dev This function burns a lot of gas. Consider calculate the hash offline then submit it using [addProof]
  /// @param document the content of the document
  /// @return true if a new proof is stored, false if a proof already exist.
  function notarize(string calldata name, bytes32 tags,
    uint size, bytes32 contentType, string calldata document)
  external
  whenNotPaused
  returns (bool)
  {
    bytes32 proof = proofFor(document);
    if (hasProof(proof)){
      revert("This document has been Notarized before!");
    }

    //store proof info. so later anyone can retrieve info abouta notarize file.
    proofDocInfo[proof].name = name;
    proofDocInfo[proof].tags = tags;
    proofDocInfo[proof].time = now;
    proofDocInfo[proof].size = size;
    proofDocInfo[proof].contentType = contentType;
    proofDocInfo[proof].creator = msg.sender;

    //group all proofs belonged to a user together
    acountProofs[msg.sender].push(proof);

    emit Notarized(msg.sender, proof, proofDocInfo[proof].time, name, tags, size, contentType);
    return true;
  }

  // helper function to get a document's keccak256
  /// @notice caculate keccak256 of a document from its data
  /// @dev keccak256 is a variation of SHA3, different from NIST-SHA3
  /// @param document the content of the document
  /// @return the proof in bytes32
  function proofFor(string memory document)
  public
  pure
  returns (bytes32)
  {
    return keccak256(bytes(document));
  }

  // verify if a document has been notarized
  /// @notice verify whether a document is notarized
  /// @dev ToDo
  /// @param document the content of the document
  /// @return boolean indicate whether the proof exist or not
  function verify(string memory document)
  public
  view
  returns (bool)
  {
    bytes32 proof = proofFor(document);
    return hasProof(proof);
  }

  // returns true if proof is stored
  /// @notice query a proof from storage
  /// @dev ToDo
  /// @param proof a bytes32 hash
  /// @return boolean indicate whether the proof is stored or not
  function hasProof(bytes32 proof)
  internal
  view
  returns(bool)
  {
    return proofDocInfo[proof].creator != address(0);
  }

  function getAllProofs()
  external
  view
  returns(bytes32[] memory proofs)
  {
    return acountProofs[msg.sender];
  }
}