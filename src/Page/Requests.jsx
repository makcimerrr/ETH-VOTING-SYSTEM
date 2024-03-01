import React from "react";
import SideBar from "../Component/SideBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function Requests({
  voterRequests,
  approveVoterRequest,
  connectedAccount,
  setConnectedAccount,
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar
        connectedAccount={connectedAccount}
        setConnectedAccount={setConnectedAccount}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Typography variant="h5">Requests</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Requester Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(voterRequests).map((requesterAddress, index) => (
              <TableRow key={index}>
                <TableCell>{requesterAddress}</TableCell>
                <TableCell>
                  {voterRequests[requesterAddress].approved
                    ? "Approved"
                    : "Pending"}
                </TableCell>
                <TableCell>
                  {!voterRequests[requesterAddress].approved && (
                    <Button
                      onClick={() => approveVoterRequest(requesterAddress)}
                      variant="contained"
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
