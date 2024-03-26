import './App.css';
import { useState } from 'react';
import { connectWallet } from './utils/erc'
import { Button, TextField, Typography, Card, CardContent } from '@mui/material';

function App() {
  const [erc20Balance, setErc20Balance] = useState('Loading...');
  const [erc20Address, setErc20Address] = useState('');
  return (
    <div className="App">
      <Typography variant="h4" gutterBottom>
        ETH and ERC20 Balance Checker
      </Typography>
      <Button variant="contained" onClick={() => connectWallet(erc20Address, setErc20Balance)}>
        Connect Wallet
      </Button>
      <TextField
        label="ERC20 Contract Address"
        fullWidth
        margin="normal"
        value={erc20Address}
        onChange={(e: any) => setErc20Address(e.target.value)}
      />
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ERC20 Balance:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {erc20Balance} ERC20 Ether
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
