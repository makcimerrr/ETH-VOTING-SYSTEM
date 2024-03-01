import React from "react";
import SideBarVote from "../Component/SideBarVote";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

export default function Vote({
  voterRequests,
  connectedAccount,
  electionState,
  candidates,
  voteCandidate,
  requestVoterRegistration,
  voted,
  votedCandidate,
  setConnectedAccount,
}) {
  const getCardBackgroundColor = (candidate, winner) =>
    electionState === 2 && candidate === winner ? "lightgreen" : "white";

  const winner = candidates.reduce(
    (prev, current) => (prev.votes > current.votes ? prev : current),
    {}
  );
  return (
    <Box
      sx={{
        display: "flex",
        background: "linear-gradient(to bottom, #23136A, #46C7CF)",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <SideBarVote
        connectedAccount={connectedAccount}
        setConnectedAccount={setConnectedAccount}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, marginTop: "55px", textAlign: "center" }}
      >
        <Typography variant="h4" color="white">
          Welcome
        </Typography>
        {voterRequests[connectedAccount] ? (
          <>
            <h3 style={{ color: "white" }}>Your Voter Status:</h3>
            <p style={{ color: "white" }}>
              {voterRequests[connectedAccount].requested
                ? voterRequests[connectedAccount].approved
                  ? "Your request has been approved. You can now vote"
                  : "Your request is pending approval. You can't vote for now. Come back later"
                : "You haven't requested voter registration yet."}
            </p>

            {voterRequests[connectedAccount].approved && (
              <>
                <h1 style={{ color: "white" }}>
                  {electionState === 0 &&
                    "Please Wait... Election has not started yet."}
                  {electionState === 1 && "VOTE FOR YOUR CANDIDATE"}
                  {electionState === 2 &&
                    "Election has ended. See the results below."}
                </h1>

                {electionState !== 0 && (
                  <>
                    <Typography variant="h5" mt={4} mb={2} color="white">
                      Candidates
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {(electionState === 1 || electionState === 2) &&
                        candidates.map((candidate, index) => (
                          <Card
                            key={index}
                            sx={{
                              backgroundColor: getCardBackgroundColor(
                                candidate,
                                winner
                              ),
                              minWidth: 275,
                              margin: 2,
                            }}
                          >
                            <CardContent sx={{ textAlign: "center" }}>
                              <Avatar
                                alt="Avatar"
                                sx={{ width: 56, height: 56, margin: "auto" }}
                              />
                              <Typography
                                variant="h6"
                                component="div"
                                color="black"
                              >
                                {candidate.name}
                              </Typography>
                              {electionState === 2 && (
                                <Typography color="black">
                                  Votes: {String(candidate.votes)}
                                </Typography>
                              )}
                            </CardContent>
                            {electionState === 1 && !voted && (
                              <CardActions sx={{ justifyContent: "center" }}>
                                <Button
                                  onClick={() => voteCandidate(index)}
                                  variant="contained"
                                >
                                  Vote
                                </Button>
                              </CardActions>
                            )}
                          </Card>
                        ))}
                    </Box>
                  </>
                )}
                {voted && electionState === 1 && (
                  <Typography variant="h6" mt={4} color="white">
                    You voted for: {votedCandidate.name}
                  </Typography>
                )}

                {electionState === 2 && (
                  <Typography variant="h6" mt={4} color="white">
                    The winner is: {winner.name}
                  </Typography>
                )}
              </>
            )}
          </>
        ) : (
          <Button onClick={requestVoterRegistration} variant="contained">
            Request Voter Registration
          </Button>
        )}
      </Box>
    </Box>
  );
}
