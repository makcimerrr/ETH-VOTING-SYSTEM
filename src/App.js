import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Page/Dashboard";
import Requests from "./Page/Requests";
import Candidates from "./Page/Candidates";
import Election from "./Page/Election";

import Vote from "./Page/Vote";
import Web3 from "web3";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./config";
import Button from "@mui/material/Button";
import Notif from "./Component/Notif";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function App() {
  const [, setWeb3] = useState(null);
  const [owner, setOwner] = useState("");
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [isVoter, setIsVoter] = useState(false); /* 
  const [loggedIn, setLoggedIn] = useState(false); */
  const [Voting, setVoting] = useState(null);
  const [electionState, setElectionState] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [contractOwner, setContractOwner] = useState("");
  const [voterRequests, setVoterRequests] = useState({});
  const [voted, setVoted] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(null);

  const initializeWeb3 = useCallback(async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);

        window.ethereum.on("accountsChanged", () => {
          setConnectedAccount(null);
          showNotification(
            "MetaMask account changed. Please refresh the page.",
            "error"
          );

          window.location.reload();
        });

        const accounts = await web3.eth.getAccounts();
        setConnectedAccount(accounts[0]);

        const contract = new web3.eth.Contract(
          TODO_LIST_ABI,
          TODO_LIST_ADDRESS
        );
        setVoting(contract);

        const owner = await contract.methods.owner().call();
        setOwner(owner);
      } else {
        showNotification("Please install Metamask", "error");
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  }, []);

  /* useEffect(() => {
    const checkConnectedAccountOnMount = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          showNotification("MetaMask Connected!", "success");
          initializeWeb3();
        }
      } catch (error) {
        console.error("Error checking connected account on mount:", error);
      }
    };

    checkConnectedAccountOnMount();
  }, [initializeWeb3]); */

  const showNotification = (message, type) => {
    if (type === "success") {
      const notification = document.getElementById("SuccessNotification");
      notification.innerText = message;
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.display = "none";
      }, 3000);
    } else {
      const notification = document.getElementById("ErrorNotification");
      notification.innerText = message;
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.display = "none";
      }, 3000);
    }
  };

  const addCandidate = async () => {
    try {
      if (Voting && connectedAccount === contractOwner) {
        if (connectedAccount !== owner) {
          const errorMessage = "Only the contract owner can add candidates.";
          showNotification(errorMessage, "error");
          return;
        } else if (newCandidateName === "") {
          const errorMessage = "Please enter a candidate name.";
          showNotification(errorMessage, "error");
          return;
        } else if (electionState !== 0) {
          const errorMessage =
            "The election has already started. Please end the election before adding candidates.";
          showNotification(errorMessage, "error");
          return;
        }
        await Voting.methods
          .addCandidate(newCandidateName)
          .send({ from: connectedAccount });
        getCandidates();
        document.querySelector("input-candidate").value = "";
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const getCandidates = useCallback(async () => {
    if (Voting) {
      try {
        const count = await Voting.methods.candidatesCount().call();
        const temp = [];
        for (let i = 0; i < count; i++) {
          const candidate = await Voting.methods.getCandidateDetails(i).call();
          temp.push({ name: candidate[0], votes: candidate[1] });
        }
        setCandidates(temp);
      } catch (error) {
        console.error("Error getting candidates:", error);
      }
    }
  }, [Voting]);

  const getVotedStatus = useCallback(async () => {
    try {
      const hasVoted = await Voting.methods
        .getVotedStatus(connectedAccount)
        .call();
      setVoted(hasVoted);
    } catch (error) {
      console.error("Error checking voted status:", error);
    }
  }, [Voting, connectedAccount]);

  const getElectionState = useCallback(async () => {
    if (Voting) {
      try {
        const state = await Voting.methods.electionState().call();
        setElectionState(parseInt(state));
      } catch (error) {
        console.error("Error getting election state:", error);
      }
    }
  }, [Voting]);

  const getContractOwner = useCallback(async () => {
    if (Voting) {
      try {
        const ownerAddress = await Voting.methods.owner().call();
        setContractOwner(ownerAddress);
      } catch (error) {
        console.error("Error getting contract owner:", error);
      }
    }
  }, [Voting]);

  const getVoterRequests = useCallback(async () => {
    if (Voting) {
      try {
        const voterAddresses = await Voting.methods
          .getAllVoterAddresses()
          .call();
        const requests = {};

        for (const voterAddress of voterAddresses) {
          const request = await Voting.methods
            .voterRequests(voterAddress)
            .call();
          requests[voterAddress] = request;
        }

        setVoterRequests(requests);
      } catch (error) {
        console.error("Error getting voter requests:", error);
      }
    }
  }, [Voting]);

  const getVotedCandidate = useCallback(async () => {
    if (Voting) {
      try {
        const votedCandidateId = await Voting.methods
          .votedCandidates(connectedAccount)
          .call();
        const votedCandidate = candidates[votedCandidateId];
        setVotedCandidate(votedCandidate);
      } catch (error) {
        console.error("Error getting voted candidate:", error);
      }
    }
  }, [Voting, connectedAccount, candidates]);

  const voteCandidate = async (index) => {
    try {
      if (Voting) {
        if (electionState !== 1) {
          const errorMessage = "Election is not in progress.";
          showNotification(errorMessage, "error");
          return;
        } else if (isVoter === false) {
          const errorMessage = "You are not a voter.";
          showNotification(errorMessage, "error");
          return;
        } else if (voterRequests[connectedAccount] === true) {
          const errorMessage = "You have already voted.";
          showNotification(errorMessage, "error");
          return;
        }
        await Voting.methods.vote(index).send({ from: connectedAccount });
        getCandidates();
        setVoted(true);
      }
    } catch (error) {
      console.error("Error voting for candidate:", error);
    }
  };

  const requestVoterRegistration = async () => {
    try {
      if (Voting) {
        if (electionState !== 0) {
          const errorMessage = "Voter registration closed";
          showNotification(errorMessage, "error");
          return;
        } else if (voterRequests[connectedAccount] === true) {
          const errorMessage = "You have already requested voter registration.";
          showNotification(errorMessage, "error");
          return;
        } else if (isVoter === true) {
          const errorMessage = "You are already a voter.";
          showNotification(errorMessage, "error");
          return;
        }
        await Voting.methods
          .requestVoterRegistration()
          .send({ from: connectedAccount });
        getVoterRequests();
      }
    } catch (error) {
      showNotification(error, "error");
      console.error("Error requesting voter registration:", error);
    }
  };

  const approveVoterRequest = async (requesterAddress) => {
    try {
      if (Voting) {
        const voterRequests = await Voting.methods
          .voterRequests(requesterAddress)
          .call();
        console.log(voterRequests);
        if (connectedAccount !== contractOwner) {
          const errorMessage =
            "Only the contract owner can approve voter registration.";
          showNotification(errorMessage, "error");
          return;
        } else if (electionState !== 0) {
          const errorMessage = "Voter registration closed";
          showNotification(errorMessage, "error");
          return;
        } else if (voterRequests.requested === false) {
          const errorMessage =
            "This voter has not requested voter registration.";
          showNotification(errorMessage, "error");
          return;
        } else if (voterRequests.approved === true) {
          const errorMessage = "This voter has already been approved.";
          showNotification(errorMessage, "error");
          return;
        }
        await Voting.methods
          .approveVoterRequest(requesterAddress)
          .send({ from: connectedAccount });
        getVoterRequests();
      }
    } catch (error) {
      console.error("Error approving voter request:", error);
    }
  };

  useEffect(() => {
    const getIsVoterStatus = async () => {
      try {
        const status = await Voting.methods.isVoter(connectedAccount).call();
        setIsVoter(status);
      } catch (error) {
        console.error(error);
      }
    };
    if (Voting) {
      getIsVoterStatus();
      getElectionState();
      getCandidates();
      getContractOwner();
      getVoterRequests();
      getVotedStatus();
      getVotedCandidate();
    }
  }, [
    Voting,
    connectedAccount,
    getCandidates,
    getElectionState,
    getContractOwner,
    getVoterRequests,
    getVotedStatus,
    getVotedCandidate,
  ]);

  const handleAgree = async () => {
    if (electionState === 0) {
      try {
        if (Voting) {
          const candidatesCount = await Voting.methods.candidatesCount().call();
          if (connectedAccount !== contractOwner) {
            const errorMessage =
              "Only the contract owner can start the election.";
            showNotification(errorMessage);
            return;
          } else if (candidatesCount < 2) {
            const errorMessage =
              "Vote needs a minimum of 2 choices. Please add candidates before starting the election.";
            showNotification(errorMessage);
            return;
          }
          await Voting.methods.startElection().send({ from: connectedAccount });
          getElectionState();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (electionState === 1) {
      try {
        if (Voting) {
          if (connectedAccount !== contractOwner) {
            const errorMessage =
              "Only the contract owner can start the election.";
            showNotification(errorMessage);
            return;
          } else if (electionState !== 1) {
            const errorMessage = "The election is not in progress.";
            showNotification(errorMessage);
            return;
          }
          await Voting.methods.endElection().send({ from: connectedAccount });
          getElectionState();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (electionState === 2) {
      try {
        if (Voting) {
          if (connectedAccount !== contractOwner) {
            const errorMessage =
              "Only the contract owner can start the election.";
            showNotification(errorMessage);
            return;
          } else if (electionState !== 2) {
            const errorMessage = "The election is not ended.";
            showNotification(errorMessage);
            return;
          }
          await Voting.methods.resetElection().send({ from: connectedAccount });
          getElectionState();
          getCandidates();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const resetCandidates = async () => {
    try {
      if (Voting && connectedAccount === contractOwner) {
        if (connectedAccount !== contractOwner) {
          const errorMessage = "Only the contract owner can reset candidates.";
          showNotification(errorMessage, "error");
          return;
        } else if (electionState !== 0) {
          const errorMessage =
            "The election has already started. Please end the election before resetting candidates.";
          showNotification(errorMessage, "error");
          return;
        } else if (candidates.length === 0) {
          const errorMessage =
            "There are no candidates. Please add candidates before resetting.";
          showNotification(errorMessage, "error");
          return;
        }
        await Voting.methods.resetCandidates().send({ from: connectedAccount });
        getCandidates(); // Refresh the candidates list after resetting
      }
    } catch (error) {
      console.error("Error resetting candidates:", error);
    }
  };

  return (
    <BrowserRouter>
      <Notif />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundImage: !connectedAccount
            ? `url('https://media.discordapp.net/attachments/1098242157992755340/1213095282695344158/488.png?ex=65f43a05&is=65e1c505&hm=72958eaf9855241a28ec65b0b6bf32acd04fc5eca173ae18326c30467c5daef8&=&format=webp&quality=lossless&width=880&height=660'), linear-gradient(to bottom, #23136A, #2F136A)`
            : "none",
          backgroundSize: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {!connectedAccount && (
          <>
            <Typography
              variant="h4"
              color="white"
              sx={{
                position: "absolute",
                top: "45%",
                left: "70%",
                transform: "translate(-50%, -50%)",
              }}
            >
              DApp Voting System
            </Typography>
            <Button
              onClick={initializeWeb3}
              variant="contained"
              sx={{
                position: "absolute",
                top: "50%",
                left: "70%",
                transform: "translateX(-50%)",
                zIndex: 1,
              }}
            >
              Connect to Metamask
            </Button>
          </>
        )}
        {connectedAccount === contractOwner ? (
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  connectedAccount={connectedAccount}
                  setConnectedAccount={setConnectedAccount}
                />
              }
            />
            <Route
              path="/requests"
              element={
                <Requests
                  voterRequests={voterRequests}
                  approveVoterRequest={approveVoterRequest}
                  connectedAccount={connectedAccount}
                  setConnectedAccount={setConnectedAccount}
                />
              }
            />
            <Route
              path="/candidates"
              element={
                <Candidates
                  candidates={candidates}
                  electionState={electionState}
                  resetCandidates={resetCandidates}
                  newCandidateName={newCandidateName}
                  setNewCandidateName={setNewCandidateName}
                  addCandidate={addCandidate}
                  connectedAccount={connectedAccount}
                  setConnectedAccount={setConnectedAccount}
                />
              }
            />
            <Route
              path="/election"
              element={
                <Election
                  electionState={electionState}
                  handleAgree={handleAgree}
                  connectedAccount={connectedAccount}
                  setConnectedAccount={setConnectedAccount}
                />
              }
            />
          </Routes>
        ) : (
          <>
            {connectedAccount && (
              <Routes>
                <Route
                  path="/"
                  element={
                    <Vote
                      voterRequests={voterRequests}
                      connectedAccount={connectedAccount}
                      electionState={electionState}
                      candidates={candidates}
                      voteCandidate={voteCandidate}
                      requestVoterRegistration={requestVoterRegistration}
                      voted={voted}
                      votedCandidate={votedCandidate}
                      setConnectedAccount={setConnectedAccount}
                    />
                  }
                />
              </Routes>
            )}
          </>
        )}
      </Box>
    </BrowserRouter>
  );
}
