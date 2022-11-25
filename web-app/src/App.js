import { useEffect, useRef, useState } from 'react'
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import abi from './abi.json'
import ContractAddresses from './contract-addresses.json'
import './App.css';

const MinterMock = abi.output.contracts["contracts/MinterMock.sol"].MinterMock.abi
const Recruitment = abi.output.contracts["contracts/Recruitment.sol"].Recruitment.abi
const EnsSubdomainFactory = abi.output.contracts["contracts/EnsSubdomainFactory.sol"].EnsSubdomainFactory.abi
console.log(MinterMock)
console.log(Recruitment)
console.log(EnsSubdomainFactory)

function App() {
  const [web3Modal, setWeb3Modal] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [currentAccount, setCurrentAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [address, setAddress] = useState(null)
  const [contract_EnsSubdomainFactory, setContract_EnsSubdomainFactory] = useState(null)
  const [contract_Recruitment, setContract_Recruitment] = useState(null)
  const [contract_MinterMock, setContract_MinterMock] = useState(null)
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
      setContract_EnsSubdomainFactory(new web3.eth.Contract(EnsSubdomainFactory, ContractAddresses.EnsSubdomainFactory))
      setContract_Recruitment(new web3.eth.Contract(Recruitment, ContractAddresses.Recruitment))
      setContract_MinterMock(new web3.eth.Contract(MinterMock, ContractAddresses.MinterMock))
      web3.eth.getAccounts().then(accounts => {
        setCurrentAccount(accounts[0])
      })
    }
  },[web3])

  useEffect(() => {
    if (contract_Recruitment && currentAccount) {
      contract_Recruitment.methods.getWhitelistedTokenAddresses(
        web3.utils.asciiToHex("DAI")
      ).call({from: currentAccount}, function(error, result){
          console.log("getWhitelistedTokenAddresses", error, result)
      })

      // contract_Recruitment.methods.whitelistToken(
      //   web3.utils.asciiToHex('DAI'),
      //   ContractAddresses.MinterMock
      // ).send({from: currentAccount }).then(res => { console.log(res) })


      contract_MinterMock.methods.balanceOf(currentAccount).call().then(result => {
          console.log("daiContract balanceOf",result)
      })
    }
  },[contract_Recruitment, currentAccount])
  
  const connectWallet = async () => {
    const _provider = await web3Modal.connect()
    _provider && setProvider(_provider)
  }

  const getGasAmountFor_Recruitment_initialDepositDAI = async () => {
    return await contract_Recruitment.methods.initialDeposit(1000, web3.utils.asciiToHex("DAI Mock")).estimateGas({ from: currentAccount });
  }

  const initialDepositOnClick = async () => {
    let txCount = await web3.eth.getTransactionCount(currentAccount),
      decimals = await contract_MinterMock.methods.decimals().call({ from: currentAccount }),
      value = `1000${'0'.repeat(decimals)}`
    console.log("decimals",decimals)
    console.log("txCount", txCount, await web3.eth.getGasPrice())
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      from: currentAccount,
      //gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
      gas:      10000000,
      //gasLimit: 8000000
    }

    // const gasAmmount = await getGasAmountFor_Recruitment_initialDepositDAI();
    // console.log("gasAmmount", gasAmmount);
    // return;

    console.log(currentAccount);
    console.log("TokenAddress", await contract_Recruitment.methods.TokenAddress().call({from: currentAccount}))
    console.log("SenderAddress", await contract_Recruitment.methods.SenderAddress().call({from: currentAccount}))
    console.log("ThisAddress", await contract_Recruitment.methods.ThisAddress().call({from: currentAccount}))

    
    let approveReceipt = await contract_MinterMock.methods.approve(ContractAddresses.Recruitment, value).send({ from: currentAccount });
    console.log("approveReceipt", approveReceipt);
    let response = await contract_Recruitment.methods.initialDeposit(
      value,
      web3.utils.asciiToHex('DAI')
    ).send(txObject).then(res => { console.log(res) })
    console.log(response)
  }

  return (
    <div className='App'>
      {!web3 && <button onClick={()=>{connectWallet()}}>Connect to your wallet!</button>}
      {web3 && (
        <div className='form'>
          <h1>Welcome you are logged in! {currentAccount}</h1>

          <hr/>
          <h1>Initial Deposit</h1>
          <div>
            <input placeholder='month1 refund %' />
          </div>
          <div>
            <input placeholder='month2 refund %' />
          </div>
          <div>
            <input placeholder='month3 refund %' />
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
