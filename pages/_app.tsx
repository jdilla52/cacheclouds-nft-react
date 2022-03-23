import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

const chains = defaultChains;

type Connector =
  | InjectedConnector
  | WalletConnectConnector
  | WalletLinkConnector;

const connectors = ({ chainId }: { chainId?: number }): Connector[] => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: "NextJS-wagmi",
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ];
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider autoConnect connectors={connectors}>
      <Component {...pageProps} />
    </Provider>
  );
}

// import "./App.css";
// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import Aos from "aos";
// import "aos/dist/aos.css";
//
// import Home from "./pages/Homes";
// import Terms from "./pages/Terms";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Loader from "./components/Loader";
//
// import Web3 from "web3";
// import PastelContract from "./abis/UndeadPastelClub.json";
//
// const App = () => {
//   const [account, setAccount] = useState(null);
//   const [metamask, setMetamask] = useState(false);
//   const [isWalletConnected, setIsWalletConnected] = useState(false);
//   const [isWhitelisted, setIsWhitelisted] = useState(null);
//   const [startDate, setStartDate] = useState(new Date(1642039200 * 1000));
//   const [publicStartDate, setPublicStartDate] = useState(
//       new Date(1642039200 * 1000)
//   );
//   const [contract, setContract] = useState(null);
//   const [isPaused, setIsPaused] = useState(null);
//   const [isSoldOut, setIsSoldOut] = useState(null);
//   const [exceedLimit, setExceedLimit] = useState(null);
//   const [isPresale, setIsPresale] = useState(false);
//   const [isPublic, setIsPublic] = useState(false);
//   const [nftLimit, setnftLimit] = useState(null);
//   const [numberOfToken, setNumberOfToken] = useState(null);
//   const [currentMaxSupply, setCurrentMaxSupply] = useState(null);
//   const [totalSupply, setTotalSupply] = useState(null);
//   const [preSaleDate, setPreSaleDate] = useState(null);
//   const [isActive, setIsActive] = useState(false);
//   const [count, setCount] = useState(1);
//   const [isMinting, setIsMinting] = useState(false);
//   const [alertState, setAlertState] = useState({
//     open: false,
//     message: "",
//     severity: undefined,
//   });
//
//   useEffect(() => {
//     Aos.init({ duration: 1000, once: true });
//     loadWeb3();
//   }, []);
//
//   useEffect(() => {
//     if (contract != null && contract.methods != null && account != null) {
//       getInfos();
//     }
//   }, [contract]);
//
//   const loadWeb3 = async () => {
//     if (window.ethereum) {
//       //ALL GOOD
//       window.web3 = new Web3(window.ethereum);
//       setMetamask(true);
//
//       window.web3.eth.getAccounts().then(async (addr) => {
//         // Set User account into state
//         if (addr.length > 0) {
//           setIsWalletConnected(true);
//         } else {
//           setIsWalletConnected(false);
//         }
//       });
//       loadBlockchainData();
//     } else if (window.web3) {
//       //display CONNECT WALLET
//       window.web3 = new Web3(window.web3.currentProvider);
//
//       setMetamask(true);
//       // setIsWalletConnected(false);
//       loadBlockchainData();
//     } else {
//       //METAMASK NOT INSTALLED
//       setMetamask(false);
//     }
//   };
//
//   const loadBlockchainData = async () => {
//     const web3 = window.web3;
//     // Load account
//     const accounts = await web3.eth.getAccounts();
//     setAccount(accounts[0]);
//
//     const networkId = await web3.eth.net.getId();
//     const networkData = PastelContract.networks[networkId];
//     if (networkData) {
//       const abi = PastelContract.abi;
//       const address = networkData.address;
//       const contract = new web3.eth.Contract(abi, address, {
//         gas: count * 125000 + 150000,
//       });
//       setContract(contract);
//     } else {
//       // window.alert("Smart contract not deployed to detected network.");
//     }
//   };
//
//   if (window.web3) {
//     window.ethereum.on("accountsChanged", function () {
//       window.web3.eth.getAccounts().then((accounts) => {
//         window.location.reload();
//       });
//     });
//
//     window.ethereum.on("networkChanged", function (networkId) {
//       window.location.reload();
//     });
//   }
//
//   const getInfos = () => {
//     contract.methods
//         .preSaleDate()
//         .call()
//         .then((presaleDate) => {
//           setPreSaleDate(new Date(presaleDate * 1000));
//
//           contract.methods
//               .publicSaleDate()
//               .call()
//               .then((publicSaleDate) => {
//                 const now = Date.now();
//                 if (
//                     now > new Date(presaleDate * 1000) &&
//                     now < new Date(publicSaleDate * 1000)
//                 ) {
//                   setIsPresale(true);
//                   contract.methods
//                       .nftPerAddressLimitPresale()
//                       .call()
//                       .then((limit) => {
//                         setnftLimit(parseInt(limit));
//                         contract.methods
//                             .walletOfOwner(account)
//                             .call()
//                             .then((tokens) => {
//                               setNumberOfToken(tokens.length);
//
//                               if (tokens.length >= limit) {
//                                 setExceedLimit(true);
//                               }
//                             });
//                       });
//
//                   contract.methods
//                       .preSaleMaxSupply()
//                       .call()
//                       .then((maxSupply) => {
//                         setCurrentMaxSupply(parseInt(maxSupply));
//                       });
//                 } else if (now > publicSaleDate * 1000) {
//                   setIsPublic(true);
//                   setIsPresale(false);
//
//                   contract.methods
//                       .nftPerAddressLimit()
//                       .call()
//                       .then((limit) => {
//                         setnftLimit(parseInt(limit));
//                         contract.methods
//                             .walletOfOwner(account)
//                             .call()
//                             .then((tokens) => {
//                               setNumberOfToken(tokens.length);
//
//                               if (tokens.length >= limit) {
//                                 setExceedLimit(true);
//                               } else {
//                                 setExceedLimit(false);
//                               }
//                             });
//                       });
//
//                   contract.methods
//                       .maxSupply()
//                       .call()
//                       .then((maxSupply) => {
//                         setCurrentMaxSupply(parseInt(maxSupply));
//                       });
//                 } else {
//                   setnftLimit(0);
//                 }
//               });
//         });
//
//     contract.methods
//         .paused()
//         .call()
//         .then((response) => {
//           setIsPaused(response);
//         });
//
//     contract.methods
//         .isWhitelisted(account)
//         .call()
//         .then((response) => {
//           setIsWhitelisted(response);
//         });
//
//     contract.methods
//         .maxSupply()
//         .call()
//         .then((maxSupply) => {
//           // setTotalSold(totalSold);
//           contract.methods
//               .totalSupply()
//               .call()
//               .then((response) => {
//                 setTotalSupply(parseInt(response));
//                 if (parseInt(response) >= parseInt(maxSupply)) {
//                   // setIsSoldOut(true);
//                 }
//               });
//         });
//   };
//
//   const getCost = async () => {
//     const cost_per_mint = await contract.methods.getCurrentCost().call();
//     return cost_per_mint;
//   };
//
//   const mintToken = async () => {
//     await loadWeb3();
//
//     contract.options.gas = count * 150000 + 130000;
//
//     if (isPaused) {
//       setAlertState({
//         open: true,
//         message: "The minting is on pause",
//         severity: "error",
//       });
//     } else if (isPresale == false && isPublic == false) {
//       setAlertState({
//         open: true,
//         message: "Presale has not started yet",
//         severity: "error",
//       });
//     } else if (isPublic && count > 10) {
//       setAlertState({
//         open: true,
//         message: "Can't mint more than 10 apes per transaction",
//         severity: "error",
//       });
//     } else if (isPresale && count > 1) {
//       setAlertState({
//         open: true,
//         message: "Can't mint more than 1 in presale",
//         severity: "error",
//       });
//     } else if (isPresale && !isWhitelisted && !isPublic) {
//       setAlertState({
//         open: true,
//         message: "You're not whitelisted, come back for the public sale",
//         severity: "error",
//       });
//     } else if (exceedLimit) {
//       setAlertState({
//         open: true,
//         message: "You've reached the limit of apes per wallet",
//         severity: "error",
//       });
//     } else if (numberOfToken != null && numberOfToken + count > nftLimit) {
//       setAlertState({
//         open: true,
//         message: "You've reached the limit of apes per wallet",
//         severity: "error",
//       });
//     } else if (isSoldOut) {
//       setAlertState({
//         open: true,
//         message: "The collection is sold out",
//         severity: "error",
//       });
//     } else if (totalSupply + count > currentMaxSupply) {
//       let msg = "";
//       if (isPublic) {
//         msg = "Not enough apes left";
//       } else {
//         msg = "Presale supply sold out ";
//       }
//       setAlertState({
//         open: true,
//         message: msg,
//         severity: "error",
//       });
//     } else {
//       setIsMinting(true);
//
//       const cost_per_mint = await getCost();
//       const cost = count * cost_per_mint;
//       console.log(contract.options.gas);
//
//       contract.methods
//           .mint(count)
//           .send({ from: account, value: cost.toString() })
//           .once("receipt", (receipt) => {
//             setAlertState({
//               open: true,
//               message: "Congrat's! Welcome in the world of Pastel",
//               severity: "success",
//             });
//             // fireConfetti();
//             getInfos();
//             setIsMinting(false);
//           })
//           .catch((e) => {
//             setIsMinting(false);
//           });
//     }
//   };
//
//   if (window.web3) {
//     window.ethereum.on("accountsChanged", function () {
//       window.web3.eth.getAccounts().then((accounts) => {
//         window.location.reload();
//       });
//     });
//
//     window.ethereum.on("networkChanged", function (networkId) {
//       window.location.reload();
//     });
//   }
//
//   return (
//       <>
//         <Loader />
//         <Navbar />
//         <Router>
//           <Switch>
//             <Route exact path="/">
//               <Home
//                   alertState={alertState}
//                   setAlertState={setAlertState}
//                   startDate={startDate}
//                   publicStartDate={publicStartDate}
//                   metamask={metamask}
//                   isWalletConnected={isWalletConnected}
//                   mint={mintToken}
//                   startDate={startDate}
//                   isActive={isActive}
//                   setIsActive={setIsActive}
//                   setCount={setCount}
//                   count={count}
//                   isPaused={isPaused}
//                   isSoldOut={isSoldOut}
//                   isWhitelisted={isWhitelisted}
//                   exceedLimit={exceedLimit}
//                   isPresale={isPresale}
//                   isPublic={isPublic}
//                   isMinting={isMinting}
//               />
//             </Route>
//             <Route exact path="/terms">
//               <Terms />
//             </Route>
//           </Switch>
//         </Router>
//         <Footer />
//       </>
//   );
// };
//
// export default App;
