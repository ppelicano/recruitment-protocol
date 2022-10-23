import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal'
import Web3 from 'web3'
import './App.css';

function App() {
  const [web3Modal, setWeb3Modal] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [provider, setProvider] = useState(null)
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
      provider.on("accountsChanged", (accounts) => {
        console.log("accountsChanged", accounts)
        if (!accounts.length) {
          setProvider(null)
          setWeb3(null)
        } 
      });
      
      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        console.log("chainChanged", chainId);
      });
      
      // Subscribe to provider connection
      provider.on("connect", (info) => {
        console.log("connect",info);
      });
      
      // Subscribe to provider disconnection
      provider.on("disconnect", (error) => {
        console.log("disconnect",error);
      });
    }
    
    setWeb3(provider ? new Web3(provider) : null)
  },[provider])

  const connectWallet = async () => {
    
    const _provider = await web3Modal.connect()
    _provider && setProvider(_provider)
  }

  const createSecryptSubdomain = async () => {
    // setNewSubdomainReceipt({loading: true})
    // const txOptions = {
    //   nonce: web3.utils.toHex(web3.eth.getTransactionCount(account)),
    //   //gasLimit: web3.utils.toHex(3000000),
    //   gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
    //   //gas: 1000000,
    //   from: account
    // }
    // secryptContract && secryptContract.methods.newSubdomain(account, account).send(txOptions)
    //       .then((txRaw) => {
    //         console.log("THEN => ", txRaw)
    //         setNewSubdomainReceipt({txHash: txRaw.transactionHash})
    //       })
    //       .catch((error)=> {
    //         Object.keys(error).forEach(item => {
    //           console.log("ERROR CREATING SECRYPT SUBDOMAIN", error)
    //           if (item === "receipt" && error?.receipt?.transactionHash) {
    //             setNewSubdomainReceipt({errorHash: error.receipt.transactionHash})
    //           }
    //           else {
    //             setNewSubdomainReceipt({error: error})
    //           }
    //         })
    //       })
  }

console.log("web3", web3)
  return (
    <div className="App">
      {!web3 && <button onClick={()=>{connectWallet()}}>Connect to your wallet!</button>}
      {web3 && <button onClick={()=>{createSecryptSubdomain()}}>Create your secret!</button>}
    </div>
  );
}

export default App;
