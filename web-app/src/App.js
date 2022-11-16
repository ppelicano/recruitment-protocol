import { useEffect, useRef, useState } from 'react';
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import EnsSubdomainFactory from './ABIS/EnsSubdomainFactory.json'
import Recruitment from './ABIS/Recruitment.json'
import MinterMock from './ABIS/MinterMock.json'
import ContractAddresses from './contract-addresses.json'
import './App.css';

function App() {
  const input_whitelist_token_contract = useRef(null);
  const input_whitelist_token_symbol = useRef(null);
  const [web3Modal, setWeb3Modal] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [currentAccount, setCurrentAccount] = useState(null)
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
    web3Modal && web3Modal.connect().then(provider => {
      setWeb3(new Web3(provider))
    })
    //web3Modal && connectWallet()
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
      setContract_EnsSubdomainFactory(new web3.eth.Contract(EnsSubdomainFactory.abi, ContractAddresses.EnsSubdomainFactory))
      setContract_Recruitment(new web3.eth.Contract(Recruitment.abi, ContractAddresses.Recruitment))
      // const daiContract = new web3.eth.Contract(MinterMock.abi, ContractAddresses.MinterMock)
      // console.log("daiContract", daiContract, ContractAddresses.MinterMock)
      // daiContract.methods.balanceOf(currentAccount).call().then(result => {
      //    console.log("daiContract balanceOf",result)
      //  })
      web3.eth.getAccounts().then(accounts => {
        setCurrentAccount(accounts[0])
      })
    }
  },[web3])

  const connectWallet = async () => {
    const _provider = await web3Modal.connect()
    _provider && setProvider(_provider)
  }
  console.log("currentAccount", currentAccount)
  useEffect(() => {
    if (contract_Recruitment && currentAccount) {
      contract_Recruitment.methods.getWhitelistedTokenAddresses(
        web3.utils.asciiToHex("DAI")
      ).call({from: currentAccount}, function(error, result){
          console.log("getWhitelistedTokenAddresses", error, result)
      })
    }
  },[contract_Recruitment, currentAccount])
  
  const whitelistDaiOnClick = () => {
    contract_Recruitment.methods.whitelistToken(
      web3.utils.asciiToHex('DAI'),
      ContractAddresses.MinterMock
    ).send({from: currentAccount })
  }

  const whitelistTokenOnClick = () => {
    console.log(address)
    console.log("whitelistTokenOnClick", 
    web3.utils.asciiToHex(input_whitelist_token_symbol.current.value),
      input_whitelist_token_contract.current.value)
    contract_Recruitment.methods.whitelistToken(
      web3.utils.asciiToHex(input_whitelist_token_symbol.current.value),
      input_whitelist_token_contract.current.value
    ).send({from: currentAccount })
    //USDC
    //0xde637d4c445ca2aae8f782ffac8d2971b93a4998
    //6
    //0x55534443
    //USDT
    //0x509Ee0d083DdF8AC028f2a56731412edD63223B9
    //6
    //0x55534454

    //DAI
    //0x73967c6a0904aA032C103b4104747E88c566B1A2
  }

  const initialDepositOnClick = async () => {
    // contract_Recruitment.methods.depositUsd(
    //   1,
    //   web3.utils.asciiToHex('USDC'),
    // ).send({from: currentAccount })
    let response = await contract_Recruitment.methods.initialDeposit(
      web3.utils.asciiToHex('DAI')
    ).send({from: currentAccount });
    console.log(response)
  }

  return (
    <div className='App'>
      {!web3 && <button onClick={()=>{connectWallet()}}>Connect to your wallet!</button>}
      {web3 && (
        <div className='form'>
          <h1>Welcome you are logged in! {currentAccount}</h1>
          <hr/>
          <h1>Token whitelisting</h1>
          <div>
            <input placeholder='token contract' ref={input_whitelist_token_contract} />
          </div>
          <div>
            <input placeholder='token symbol' ref={input_whitelist_token_symbol} />
          </div>
          <div>
            <button onClick={whitelistTokenOnClick}>Whitelist TOKEN</button>
          </div>
          <div>
            <button onClick={whitelistDaiOnClick}>Whitelist DAI Mock</button>
          </div>

          <hr/>
          <h1>Initial Deposit</h1>
          <div>
            <input placeholder='month1 refund %'  />
          </div>
          <div>
            <input placeholder='month2 refund %'  />
          </div>
          <div>
            <input placeholder='month3 refund %'  />
          </div>
          <div>
            <button onClick={initialDepositOnClick}>Deposit</button>
          </div>
        </div>
      
      )}
    </div>
  );
}

export default App;
