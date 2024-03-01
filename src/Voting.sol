// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract Election {
    enum State {
        NotStarted,
        InProgress,
        Ended
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        uint256 id;
        string name;
    }

    struct VoterRequest {
        bool requested;
        bool approved;
    }

    address public owner;
    address[] public voters;
    State public electionState;

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public voted;
    mapping(address => bool) public isVoter;
    mapping(address => VoterRequest) public voterRequests;
    mapping(address => uint256) public votedCandidates;

    uint256 public candidatesCount = 0;
    uint256 public votersCount = 0;

    event Voted(uint256 indexed _candidateId);
    event VoterAdded(address indexed _voter);

    constructor() {
        owner = msg.sender;
        electionState = State.NotStarted;
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function startElection() public {
        require(msg.sender == owner, "Only owner can add candidates");
        require(electionState == State.NotStarted);
        require(candidatesCount >= 2, "Vote need minimum of 2 choices");
        electionState = State.InProgress;
    }

    function endElection() public {
        require(msg.sender == owner, "Only owner can add candidates");
        require(electionState == State.InProgress);
        electionState = State.Ended;
    }

    function resetElection() public {
        require(msg.sender == owner, "Only owner can add candidates");
        require(electionState == State.Ended);
            // Delete candidates
    for (uint256 i = 0; i < candidatesCount; i++) {
        delete candidates[i];
    }
    candidatesCount = 0;
    for (uint256 i = 0; i < votersCount; i++) {
        voted[voters[i]] = false;
    }
    electionState = State.NotStarted;
    }

    function addCandidate(string memory _name) public {
        require(owner == msg.sender, "Only owner can add candidates");
        require(electionState == State.NotStarted, "Election has already started");

        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
    }

    function requestVoterRegistration() public {
        require(!isVoter[msg.sender], "You are already a voter");
        require(!voterRequests[msg.sender].requested, "Request already submitted");
        require(electionState == State.NotStarted, "Voter registration closed");

        voterRequests[msg.sender].requested = true;

        // Add the requester to the voters array
        voters.push(msg.sender);
    }

    function approveVoterRequest(address _requester) public {
        require(msg.sender == owner, "Only the owner can approve voter requests");
        require(!isVoter[_requester], "Voter already added");
        require(voterRequests[_requester].requested, "No request found");
        require(electionState == State.NotStarted, "Voter registration closed");

        voterRequests[_requester].approved = true;
        isVoter[_requester] = true;

        emit VoterAdded(_requester);
        votersCount ++;
    }


    function vote(uint256 _candidateId) public {
        require(electionState == State.InProgress, "Election is not in progress");
        require(isVoter[msg.sender], "Non-authorised user cannot vote");
        require(!voted[msg.sender], "You have already voted");
        require(_candidateId >= 0 && _candidateId < candidatesCount, "Invalid candidate ID");

        candidates[_candidateId].voteCount++;
        voted[msg.sender] = true;
        votedCandidates[msg.sender] = _candidateId;

        emit Voted(_candidateId);
    }

    function getCandidateDetails(uint256 _candidateId) public view returns (string memory, uint256) {
        require(_candidateId >= 0 && _candidateId < candidatesCount, "Invalid candidate ID");
        return (candidates[_candidateId].name, candidates[_candidateId].voteCount);
    }

    function getAllVoterAddresses() public view returns (address[] memory) {
    return voters;
}

    function getVotedStatus(address _voter) public view returns (bool) {
        return voted[_voter];
    }

function resetCandidates() public {
    require(msg.sender == owner, "Only the owner can reset candidates");
    require(electionState == State.NotStarted);
    for (uint256 i = 0; i < candidatesCount; i++) {
        delete candidates[i];
    }
    
    candidatesCount = 0;
}
}