import React from "react";
import SideBar from "../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Dashboard({ connectedAccount, setConnectedAccount }) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar
        connectedAccount={connectedAccount}
        setConnectedAccount={setConnectedAccount}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Typography variant="h4">Welcome to Dashboard</Typography>
        <Typography paragraph>You are admin</Typography>
      </Box>
    </Box>
  );
}
