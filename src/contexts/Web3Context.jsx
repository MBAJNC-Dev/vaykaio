
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async (walletType = 'metamask') => {
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const web3Signer = await web3Provider.getSigner();
        const userAddress = await web3Signer.getAddress();
        const userBalance = await web3Provider.getBalance(userAddress);
        const userNetwork = await web3Provider.getNetwork();

        setProvider(web3Provider);
        setSigner(web3Signer);
        setAddress(userAddress);
        setBalance(ethers.formatEther(userBalance));
        setNetwork(userNetwork);

        // Save to PocketBase
        if (pb.authStore.isValid) {
          try {
            await pb.collection('wallet_addresses').create({
              user_id: pb.authStore.model.id,
              wallet_address: userAddress,
              blockchain: userNetwork.name || 'ethereum',
              balance: parseFloat(ethers.formatEther(userBalance))
            }, { $autoCancel: false });
          } catch (e) {
            // Might already exist, ignore or update
          }
        }

        toast.success('Wallet connected successfully');
      } else {
        toast.error('Please install MetaMask or another Web3 wallet');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress('');
    setBalance('0');
    setNetwork(null);
    toast.info('Wallet disconnected');
  };

  return (
    <Web3Context.Provider value={{ provider, signer, address, balance, network, isConnecting, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
