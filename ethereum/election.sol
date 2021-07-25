pragma solidity ^0.4.25;
contract ElectionFactory {
    uint256 ElectionCount;
    address[] CreatedElections;
    address public FactoryOwner;
    
    constructor() public {
        FactoryOwner = msg.sender;
    }
    
    modifier Access() {
        require(msg.sender == FactoryOwner, "Election can be created/deleted by 'FactoryOwner'");
         _;
    }
    
    function createElections(string name) public {
        address newElection = new Election(name, msg.sender);
        CreatedElections.push(newElection);
        ElectionCount++;
    }
    
    function getDeployedElections() public view returns (address[]) {
        return CreatedElections;
    }
    
    function removeElection(uint256 id) public Access {
        require(ElectionCount > 0, "Invalid Elction");
        delete CreatedElections[id];
        ElectionCount--;
    }
}


contract Election {
    
    struct Voter {
        uint256 VoterId;
        string name;
        bool ifvoted;
        bool authorised;
    }
    
    struct Candidate {
        string name;
        int CandidateVote;
    }

    Candidate[] public candidates;
    address public ElectionCreator;  //owner of election
    string ownerName;
    uint256 CandidateCount;
    uint256 VotersCount;
    uint256 VoterRequest;
    uint256 WinnerId;
    bool ElectionComplete;
 
    mapping (address => Voter )  public voters; // address of voters
    mapping (uint256 => address ) public requests;
    
    constructor(string name, address creator) public {
        ElectionCreator = creator;
        ownerName = name;
    }
    
    modifier restricted() {
        require(msg.sender == ElectionCreator, "You are Not Owner");
        _;
    }
    
    modifier electionStatus() {
        require(!ElectionComplete, "Election Completed!! You Can't Vote");
        _;
    }
    
    //Adding Candidate, this can only be done by admin.
    function createCandidate(string memory name) public restricted{
        Candidate memory newCandidate = Candidate({
            name: name,
            CandidateVote: 0
        });
        candidates.push(newCandidate);
        CandidateCount++;
    }
    
    function registerVoter(string memory _name) public electionStatus  {
        require(msg.sender != ElectionCreator, "Owner is not allowed to Vote or register!!");
        require(voters[msg.sender].VoterId == 0 , "You have already Registered!");
        voters[msg.sender].VoterId = 1;
        VoterRequest++;
        voters[msg.sender] = Voter(VoterRequest, _name, false, false);
        requests[VoterRequest] = msg.sender;
    }
    
    function getVoterRequest() public view returns (uint256) {
        return VoterRequest;
    }
 
    function authorisedVoter(uint256 id) public restricted electionStatus{
        require(requests[id] != 0x0, "You are not registered");
        require(!voters[requests[id]].authorised, "You are already authorised");
        voters[requests[id]].authorised = true;
        delete requests[id];
        VotersCount++;
    }
    
    function getTotalVoters() public view returns (uint256) {
        return VotersCount;
    }
    
    function GiveVote(uint256 index) public electionStatus  {
        Candidate storage vote = candidates[index];
        require(voters[msg.sender].authorised, "You are not authorised Voter!");
        require(!voters[msg.sender].ifvoted, "You have already Voted");
        voters[msg.sender].ifvoted = true;
        vote.CandidateVote++;
    }
    
    function pickWinner() public restricted{
        
        int maxVote = -1;
        bool canPickWinner = false;
        for(uint256 i=0; i < CandidateCount; i++ ) {
            
            if(maxVote == candidates[i].CandidateVote) {
                        canPickWinner = false;
            }
            if(candidates[i].CandidateVote > maxVote ) {
                    maxVote = candidates[i].CandidateVote;
                    WinnerId = i;
                    canPickWinner = true;
            }
        }
        require(canPickWinner, "There cannot be 2 winners");
        ElectionComplete = true;
        
    }
    
    function getTotalCandidates() public view returns(uint256) {
        return CandidateCount;
    }
    
    function getWinnerName() public view returns (string memory) {
        require(ElectionComplete, "Election is yet not Completed");
        return candidates[WinnerId].name;
    }
}
