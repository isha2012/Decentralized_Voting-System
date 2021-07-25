import Web3 from 'web3';
let web3;

//this if statement will execute when their is a metamask is available
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    //we are in the browser.and meta mask is running.
    web3 = new Web3(window.web3.currentProvider);
}else {
    //We are on the server or the user is not running metamask.
    //so we setup our own provider, connects to rinkeby test network

    //own provider.
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/048e55a64a47451e98cbaefbed9d270f');
    web3 = new Web3(provider);
}

export default web3;