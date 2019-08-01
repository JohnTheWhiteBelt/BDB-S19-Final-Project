# Proof of Existence dApp 
 This project is the final project for ConsenSys Academy Blockchain Developer Bootcamp Spring 2019

## What does your project do?

* Upload a picture/video(or any other file)
* Notarize a file's existence.
* Verify whether a file is notarized before.
* Show information about a notarized file. Such as timestamp for notarization, file size, owner of the file.

## How to set it up?

* Install Node.js v10+ LTS and npm
* Install Ganache
* Install MetaMask in your browser
* Configure Ganache to use port 8545
* Configure a network pointing to local Ganache at http://127.0.0.1:8545 in MetaMask
* Run Ganache or Ganache-cli
* Use same mnemonic from Ganache to MetaMask

then run following in command line at current path.

```sh
npm install -g truffle
npm install
truffle compile
truffle migrate
npm run dev
```
Open http://localhost:3000/ in browser(All functions tested in Chrome desktop version)
