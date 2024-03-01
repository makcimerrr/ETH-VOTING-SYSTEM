import React from 'react';
import SideBar from '../Component/SideBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Election({ electionState, handleAgree, connectedAccount, setConnectedAccount }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar connectedAccount={connectedAccount} setConnectedAccount={setConnectedAccount} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Typography variant="h5">
          Election Status
        </Typography>

        <h1>{electionState === 0 &&
          "Vote has not started yet. Click to launch it"}
          {electionState === 1 && "Vote is live. Click to close it"}
          {electionState === 2 &&
            "Vote has ended. Click to reset it"}</h1>

        <Button onClick={handleAgree} variant="contained">Change Status Of Election</Button>

      </Box>
    </Box>
  );
}