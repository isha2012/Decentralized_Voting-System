import web3 from './web3';
import ElectionFactory from './build/ElectionFactory.json';

const factory = new web3.eth.Contract(JSON.parse(ElectionFactory.interface),
'0xfd363EA65650B7a506FA079c2FF9d18fa5Af5760');

export default factory;
