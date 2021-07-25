const assert = require('assert');
const ganache = require('ganache-cli');
const { createFactory } = require('react');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const ElectionFactory = require('../src/ethereum/build/ElectionFactory.json')
const Election = require('../src/ethereum/build/Election.json');

let accounts;
let electionfactory;
let election_address;
let elections;


beforeEach( async() => {
    //list of all accounts.
    accounts = await web3.eth.getAccounts();
    //console.log(accounts);

    electionfactory = await new web3.eth.Contract(
        JSON.parse(ElectionFactory.interface))
    .deploy({ data: ElectionFactory.bytecode})
    .send({ from: accounts[0], gas: '4000000'});
    const name = "Isha";

    await electionfactory.methods.createElections(name).send({
            from: accounts[0],
            gas: "1000000"  
    });
    await electionfactory.methods.createElections("Mayur").send({
      from: accounts[0],
      gas: "1000000"  
    });

    [election_address] = await electionfactory.methods.getDeployedElections().call();
    elections = await new web3.eth.Contract(
        JSON.parse(Election.interface),
        election_address
    )

});

describe('Election Contract', () => {

      it('Creating Factory and Elections..', async() => {  
           assert.ok(electionfactory.options.address);
           assert.ok(elections.options.address);
      });

      it('Election Factory Manager', async() => {
        const manager = await electionfactory.methods.FactoryOwner().call();
        assert.equal(accounts[0], manager);
      });

      it('Deleting Created Election..', async() => {
        await electionfactory.methods.removeElection(0).send({
          from: accounts[0],
          gas: "1000000",
        });
        await electionfactory.methods.removeElection(1).send({
          from: accounts[0],
          gas: "1000000",
        });
      });   

      it("Creating Candidates!!..", async() => {
        const name="Isha";
        await elections.methods.createCandidate(name).send({
           from: accounts[0],
           gas: '1000000',
        });
      });

      it('Allow people to register as voter, make them authorised and Give Vote!!!', async() => {
            const name="Isha";
            
              await elections.methods.registerVoter(name).send({
                from: accounts[1],
                gas: '1000000',
              });
              
              const isAuthorised = await elections.methods.authorisedVoter("1").call();
              assert(isAuthorised);

              try {
                await GiveVote.methods.GiveVote(0).send({
                  from: accounts[1],
                  gas: '1000000',
                });
                assert(false);
              } catch (err) {
                assert(true);
              }
      });

      it("Pick Winner", async() => {
        try {
          await elections.methods.pickWinner().send({
            from: accounts[0],
            gas: '100000',
          });
          assert(false);
        } catch(err) {
          assert(err);
        } 
      });
});


