import React from "react";
import SideBar from "../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

export default function Candidates({
  candidates,
  electionState,
  resetCandidates,
  newCandidateName,
  setNewCandidateName,
  addCandidate,
  connectedAccount,
  setConnectedAccount
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar
        connectedAccount={connectedAccount}
        setConnectedAccount={setConnectedAccount}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Typography variant="h4">Candidates List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Votes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate, index) => (
              <TableRow key={index}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{String(candidate.votes)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {electionState === 0 && (
          <>
            <label>
              New Candidate Name:
              <input
                type="text"
                className="input-candidate"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
              />
            </label>
            <Button onClick={addCandidate} variant="contained">
              Add Candidate
            </Button>
            <Button onClick={resetCandidates} variant="contained">
              Reset Candidates
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
