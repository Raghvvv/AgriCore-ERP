import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const FinanceTable = () => {
    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ p: 2 }}>Finance Table</Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Add financial data here */}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FinanceTable;
