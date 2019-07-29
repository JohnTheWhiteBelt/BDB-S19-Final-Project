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

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('ProofOfExistence.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ProofOfExistenceArtifact = data;
      App.contracts.ProofOfExistence = TruffleContract(ProofOfExistenceArtifact);

      // Set the provider for our contract
      App.contracts.ProofOfExistence.setProvider(App.web3Provider);

    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $('#fileUpload').on('change', App.handleFiles);
    $('#notarize').on('click', App.notarize);
    $('#verify').on('click', App.verify);
  },

  handleFiles: function (event) {
    const file  = event.target.files[0];
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

  notarize: function() {

    var proofOfExistenceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.ProofOfExistence.deployed().then(function(instance) {
        proofOfExistenceInstance = instance;
        return proofOfExistenceInstance.notarize(App.currentDocument, {from: account});
      }).then(function(result) {
        return alert("Done!");
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  verify: function() {

    var proofOfExistenceInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.ProofOfExistence.deployed().then(function(instance) {
        proofOfExistenceInstance = instance;
        return proofOfExistenceInstance.verify(App.currentDocument, {from: account});
      }).then(function(result) {
        if(result === true){
          return alert("Has Notorization");
        }else {
          return alert("Not Notorized");
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
