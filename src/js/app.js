App = {
  web3Provider: null,
  currentDocument: null,
  contracts: {},

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return await App.initContract();
  },

  initContract: function () {
    $.getJSON('ProofOfExistence.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ProofOfExistenceArtifact = data;
      web3.eth.net.getId().then(networkId => {
        const deployedAddress = ProofOfExistenceArtifact.networks[networkId].address
        App.contracts.ProofOfExistence = new web3.eth.Contract(ProofOfExistenceArtifact.abi, deployedAddress);

        // Set the provider for our contract
        App.contracts.ProofOfExistence.setProvider(App.web3Provider);
        App.subscribeEthEvents();
      });
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $('#fileUpload').on('change', App.handleFiles);
    $('#notarize').on('click', App.notarize);
    $('#verify').on('click', App.verify);
    App.updateCurrentAccount();

  },

  handleFiles: function (event) {
    const file = event.target.files[0];
    $('#fileName').text(file.name);
    $('#fileDate').text(file.lastModifiedDate);
    $('#fileSize').text(file.size);
    $('#fileType').text(file.type);

    console.log(file.name);
    console.log(file.size);
    console.log(file.type)
    const img = $('#imgPreview');
    const reader = new FileReader();
    reader.onloadend = function (e) {
      img.attr('src', reader.result);
      console.log(reader.result);
      App.currentDocument = reader.result;
    }
    reader.readAsDataURL(file);
  },

  notarize: function () {

    // var proofOfExistenceInstance;

    // web3.eth.getAccounts(function(error, accounts) {
    //   if (error) {
    //     console.log(error);
    //   }

    //   var account = accounts[0];

    //   App.contracts.ProofOfExistence.deployed().then(function(instance) {
    //     proofOfExistenceInstance = instance;
    //     return proofOfExistenceInstance.notarize(App.currentDocument, {from: account});
    //   }).then(function(result) {
    //     return alert("Done!");
    //   }).catch(function(err) {
    //     console.log(err.message);
    //   });

    // notarize(string calldata name, bytes32 tags, uint time,
    //   uint size, bytes32 contentType, string calldata document)
    const name = $('#fileName').text();
    const size = +$('#fileSize').text()
    const contentType = web3.utils.utf8ToHex($('#fileType').text());
    const tags = web3.utils.utf8ToHex($('#fileTags').text());

    App.contracts.ProofOfExistence.methods.notarize(
      name, tags, size, contentType, App.currentDocument).send({
        from: web3.eth.defaultAccount
      }).then(
        result => {
          return alert("Done!");
        },
        error => {
          console.log(error);
        });
    // });
  },

  verify: function () {

    // var proofOfExistenceInstance;

    // web3.eth.getAccounts(function(error, accounts) {
    //   if (error) {
    //     console.log(error);
    //   }

    //   var account = accounts[0];

    App.contracts.ProofOfExistence.methods.verify(App.currentDocument).call().then(
      result => {
        if (result === true) {
          return alert("Has Notorization");
        } else {
          return alert("Not Notorized");
        }
      },
      error => {
        console.log(error);
      });
    // });
  },

  updateCurrentAccount: function () {
    web3.eth.getAccounts().then(acounts => {
      web3.eth.defaultAccount = acounts[0];
      $('#currentAccount').text(acounts[0]);
      App.listNotarizations();

    });
    setTimeout(App.updateCurrentAccount, 5000);
  },

  listNotarizations: function () {
    if(App.contracts.ProofOfExistence){
      App.contracts.ProofOfExistence.methods.getAllProofs().call().then(
        proofs => {
          if(!proofs){
            return;
          }
          $('#notarizationList').text('');
          proofs.forEach(proof => {
            $('#notarizationList').append('<li><a>' + proof + '</a></li>');
          });
          $('#notarizationList > li > a').click(function (event) {
            App.showDocInfo(event.target.innerText);
          });
        },
        error => {
          console.log(error);
        });
    }
  },
  showDocInfo: function (proof) {
    if(App.contracts.ProofOfExistence){
    App.contracts.ProofOfExistence.methods.proofDocInfo(proof).call().then(
      docInfo => {
          $('#docName').text(docInfo.name);
          $('#docSize').text(docInfo.size);
          $('#docType').text(web3.utils.hexToUtf8(docInfo.contentType));
          $('#docTags').text(web3.utils.hexToUtf8(docInfo.tags));
          $('#notarizedDate').text(new Date(docInfo.time * 1000));
      },
      error => {
        console.log(error);
      });
    }
  },
  subscribeEthEvents: function () {
    // var options = {
    //   address: App.contracts.ProofOfExistence._address
    // };
    // var subscription = web3.eth.subscribe('logs', options, function(error, result){
    //   if(error || result == null){
    //     // Notarized
    //       console.log('Error when watching incoming transactions: ', error.message);
    //       return;
    //   }
    //   console.log('Got something back: ', result);
    // });
    // subscription.on('data', function(log){
    //     console.log(log);
    // });
    const eventJsonInterface = web3.utils._.find(
      App.contracts.ProofOfExistence._jsonInterface,
      o => o.name === 'Notarized' && o.type === 'event',
    )

    const subscription = web3.eth.subscribe('logs', {
      address: App.contracts.ProofOfExistence._address,
      topics: [eventJsonInterface.signature]
    }, (error, result) => {
      if (!error) {
        const eventObj = web3.eth.abi.decodeLog(
          eventJsonInterface.inputs,
          result.data,
          result.topics.slice(1)
        )
        alert('New Notarization, Owner: ' + eventObj.owner + ' Proof: ' + eventObj.proof);
      }


    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
