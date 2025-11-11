import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const CropsTable = () => {
    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" sx={{ p: 2 }}>Crops Table</Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Crop Name</TableCell>
                        <TableCell align="right">Planting Date</TableCell>
                        <TableCell align="right">Harvest Date</TableCell>
                        <TableCell align="right">Yield</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Add crop data here */}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CropsTable;
