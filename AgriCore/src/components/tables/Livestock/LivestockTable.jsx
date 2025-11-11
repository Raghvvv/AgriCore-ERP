import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const LivestockTable = () => {
    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ p: 2 }}>Livestock Table</Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Animal Type</TableCell>
                        <TableCell align="right">Breed</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Health Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Add livestock data here */}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LivestockTable;
