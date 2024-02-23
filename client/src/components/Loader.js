import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Loader() {
  return (
    <div className='d-flex align-items-center' style={{height: '100vh'}}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
    </div>
  );
}