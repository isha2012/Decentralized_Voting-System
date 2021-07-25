import web3 from './web3';
import Election from "../build/Election.json";

module.exports = (address) => {
	const election = new web3.eth.Contract(JSON.parse(Election.interface), address);
	return election;
}



