import Web3, { Numbers } from 'web3';
import { Popover } from '@mui/material';
import axios from 'axios';
declare global {
    interface Window {
        ethereum?: any;
    }
}
const web3 = new Web3(window.ethereum);
export const connectWallet = async (ecr20: string, setEthBalance: Function) => {
  if (!ecr20.trim()) return alert('Please enter the address！')
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    console.log('Connected account address:', accounts[0]);
    const balance = await getErc20Balance(accounts[0], ecr20)
    const ether = web3.utils.fromWei(balance, 'ether')
    setEthBalance(ether)
    console.log('balance::', balance, ether)
    // 获取当前美元价格的接口报404，暂时转换不了美元
    // const usdAmount = await convertWeiToUsd(ether)
    // console.log(`$${usdAmount} USD`);
    // 这里你可以设置状态来存储账户地址
  } catch (error) {
    console.error('Error connecting to Metamask:', error);
  }
};

export const getEthBalance: any = async (accountAddress: string): Promise<any> => {
    try {
      const balance = await web3.eth.getBalance(accountAddress);
      return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return 'Error fetching balance';
    }
};

const erc20ContractABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
]; // ERC20代币标准的ABI
// const erc20ContractAddress = '0x7939C9b7cE8BFFc6cb791eCB129f4c385e05727a';

export const getErc20Balance: any = async (accountAddress: string, erc20ContractAddress: string): Promise<any> => {
  try {
    const erc20Contract = new web3.eth.Contract(erc20ContractABI, erc20ContractAddress);
    const balance = await erc20Contract.methods.balanceOf(accountAddress).encodeABI();
    return balance;
  } catch (error) {
    console.error('Error fetching ERC20 balance:', error);
    return 'Error fetching balance';
  }
};

// 获取当前ETH兑美元的汇率
async function getEthToUsdRate() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price/ethereum?localcurrency=usd');
    const ethPrice = response.data.ethereum.usd; // 获取ETH的美元价格
    return ethPrice;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return null;
  }
}

// 将wei转换为美元
async function convertWeiToUsd(ether: any) {
  const ethToUsdRate = await getEthToUsdRate();
  if (ethToUsdRate === null) {
    console.error('ETH to USD rate not available.');
    return null;
  }

  // 计算美元价值
  const usdAmount = ether.times(ethToUsdRate);
  return usdAmount.toFixed(2); // 格式化为两位小数
}