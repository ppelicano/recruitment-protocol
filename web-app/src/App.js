import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import EnsSubdomainFactory from './ABIS/EnsSubdomainFactory.json'
import Recruitment from './ABIS/Recruitment.json'
import './App.css';

function App() {
  const [web3Modal, setWeb3Modal] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [provider, setProvider] = useState(null)
  const [address, setAddress] = useState(null)
  const [contract_EnsSubdomainFactory, setContract_EnsSubdomainFactory] = useState(null)
  const [contract_Recruitment, setContract_Recruitment] = useState(null)
  useEffect(()=>{
    setWeb3Modal(new Web3Modal({
      network: 'goerli', // optional
      cacheProvider: true, // optional
      providerOptions: {}, // required
    }))
  },[]);

  useEffect(() => {
    web3Modal && connectWallet()
  }, [web3Modal])
  
  useEffect(()=> {
    if (provider) {
      provider.on('accountsChanged', (accounts) => {
        console.log('accountsChanged', accounts)
        if (!accounts?.length) {
          setProvider(null)
          setWeb3(null)
          setAddress(null)
        } else {
          setAddress(accounts[0])
        }
      });
      
      // Subscribe to chainId change
      provider.on('chainChanged', (chainId) => {
        console.log('chainChanged', chainId);
      });
      
      // Subscribe to provider connection
      provider.on('connect', (info) => {
        console.log('connect',info);
      });
      
      // Subscribe to provider disconnection
      provider.on('disconnect', (error) => {
        console.log('disconnect',error);
      });
    }
    
    setWeb3(provider ? new Web3(provider) : null)
  },[provider])

  useEffect(()=>{
    if (web3) {
      setContract_EnsSubdomainFactory(new web3.eth.Contract(EnsSubdomainFactory.abi, '0x2dD32Ca2726cc86ba40625c2D6B7452CE5808dCa'))
      setContract_Recruitment(new web3.eth.Contract(Recruitment.abi, '0xDFfA6230381bc0280d3a585Cc33e0e3B9D87b55C'))
    }
  },[web3])

  const connectWallet = async () => {
    const _provider = await web3Modal.connect()
    _provider && setProvider(_provider)
  }

  console.log('contract_EnsSubdomainFactory', contract_EnsSubdomainFactory)
  console.log('contract_Recruitment', contract_Recruitment)
  return (
    <div className='App'>
      {!web3 && <button onClick={()=>{connectWallet()}}>Connect to your wallet!</button>}
      {web3 && <h1>Welcome you are logged in!</h1>}
    </div>
  );
}

export default App;
