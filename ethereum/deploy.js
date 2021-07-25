const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const ElectionFactory = require('./build/ElectionFactory.json');

const provider = new HDWalletProvider('viable lab leopard glove tuition squeeze merit advice quit must famous make'
, 'https://rinkeby.infura.io/v3/effa9c2d46514384b4d2e904d1b723c8');

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(ElectionFactory.interface))
    .deploy({ data: ElectionFactory.bytecode })
    .send({ gas: '3000000',  from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
    //0xfd363EA65650B7a506FA079c2FF9d18fa5Af5760
};

deploy();

