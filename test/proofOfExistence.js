var ProofOfExistence = artifacts.require("ProofOfExistence");

contract("ProofOfExistence", function(accounts) {
  it("should deploy and set owner", async () => {
    const proofOfExistence = await ProofOfExistence.new();

    assert.equal(await proofOfExistence.owner(), accounts[0]);
  });

  it("should notarize a document and emit event", async () => {
    await notarize();

    // const proofs = await proofOfExistence.getAllProofs();
    // assert.equal(proofs.length, 1);
  });

  it("should return all notarization proofs done by current account", async () => {
    const proofOfExistence = await notarize();
    const proofs = await proofOfExistence.getAllProofs();
    assert.equal(proofs.length, 1);
  });

  it("should return information of a Notarized doc", async () => {
    const proofOfExistence = await notarize();
    const proofs = await proofOfExistence.getAllProofs();
    const docInfo = await proofOfExistence.proofDocInfo(proofs[0]);
    assert.equal(docInfo.name, "a doc");
    assert.equal(web3.utils.hexToUtf8(docInfo.tags), "#test");
    assert.equal(docInfo.size, 432507);
    assert.equal(web3.utils.hexToUtf8(docInfo.contentType), "text");
    assert.equal(docInfo.creator, accounts[0]);
  });

  it("should verify a doc is notarized or not ", async () => {
    const proofOfExistence = await notarize();
    let success = await proofOfExistence.verify("This is the content of the doc");
    assert.equal(success, true);

    success = await proofOfExistence.verify("This is some content not notarized");
    assert.equal(success, false);
  });
});

async function notarize() {
  const proofOfExistence = await ProofOfExistence.new();

  const result = await proofOfExistence.notarize(
    "a doc",
    web3.utils.toHex("#test"),
    432507,
    web3.utils.toHex("text"),
    "This is the content of the doc"
  );
  assert.equal(result.receipt.status, true);
  assert.equal(result.receipt.logs[0].event, "Notarized");
  return proofOfExistence;
}
