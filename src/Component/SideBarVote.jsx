import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";

const drawerWidth = 0;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function SideBarVote({ connectedAccount, setConnectedAccount }) {
  const [open] = React.useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    setConnectedAccount(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dapp Voting System
          </Typography>
          {connectedAccount && (
            <Typography
              variant="body1"
              noWrap
              component="div"
              sx={{ marginLeft: "5rem" }}
            >
              Connected Account: {connectedAccount}
            </Typography>
          )}
          <Box sx={{ marginLeft: "auto" }}>
            <Button
              color="inherit"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
