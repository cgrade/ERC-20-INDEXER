import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
import API from '../apikey';
import { Spinner } from '@chakra-ui/react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'


function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [isConnected, togleConnect] = useState(false);
  const [isloading, togleLoading] = useState(false);
  
  async function getTokenBalance() {
    const config = {
      apiKey: API,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
    togleLoading(false)

  }

  async function connectWallet(){
    // check if metamask is installed
    if (window.ethereum){
      if (isConnected){
        await window.ethereum.request({
          "method": "wallet_revokePermissions",
          "params": [
            {
              "eth_accounts": {}
            }
          ]
        });
        togleConnect(!isConnected);
        setHasQueried(false)
      } else {
      
        // window.ethereum.isConnected ? console.log("is connected") : console.log("not connected1");
        const addresses = await window.ethereum.request({
          "method": "eth_requestAccounts",
          "params": []
        })
        setUserAddress(addresses[0]);
        togleConnect(!isConnected);
      }
    }
  }
  function uxux(){
    togleLoading(true);
    hasQueried ? togleLoading(false): togleLoading(true)
  }
  function handleClick(){
    getTokenBalance();
    uxux();
  }
  return (
        
        <Box width={'92vw'} m={'1.8vw'} p='2vw'bgColor='#112229' display="flex" alignItems="center" flexDirection={'column'}>
          <Center>
            <Flex
              alignItems={'center'}
              justifyContent="center"
              flexDirection={'column'}
            >
              <Heading mb={0} fontSize={'x-large'} color={'#fcb833'}>
                ERC-20 Token Indexer
              </Heading>
              
              <Text color={'#00aabb'}>
                Connect your wallet and this website will return all of its ERC-20
                token balances!
              </Text>
            </Flex>
          </Center>
          <Flex
            flexDirection="column"
            alignItems={'center'}
            justifyContent="center"
          >
            <Heading mt={42}>

            </Heading>
            <Text fontSize={20} fontFamily={'-moz-initial'} fontWeight={'bold'}>
              {isConnected? "Wallet Address: " + userAddress.substring(0, 5)+"......"+userAddress.substring(35) :"CONNECT YOUR WALLET"}
            </Text>
            <Button fontSize={20} onClick={connectWallet} mt={36} bgColor="#00aabb">
            {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
            </Button>
            <Button fontSize={20} onClick={handleClick} mt={36} bgColor="#e0bf20">
            <Text m={0} color={"#f90f30"}>Check ERC-20 Token Balances</Text>
            </Button>
            <Text>{isloading && <CircularProgress isIndeterminate size='50px' color='green' />}</Text>
            <Heading my={36} color="#f90f30">ERC-20 token balances:</Heading>

            {hasQueried ? (
              <SimpleGrid w={'95vw'} columns={4} spacing={25} m={'1vw'}display={'flex'} justifyContent={'center'} >
                {results.tokenBalances.map((e, i) => {
                  return (
                    <Flex
                      flexDir={'column'}
                      color="#112229"
                      bg="#fcb833"
                      w={'12vw'}
                      ml={'1vw'}
                      fontSize={'inherit'}
                
                      p={'1vw'}
                      key={i}
                      alignItems={'center'}
                      borderRadius={15}
                      justifyContent="center"
                    >
                      <Box>
                        <b>Symbol:</b> ${tokenDataObjects[i].symbol}&nbsp;
                      </Box>
                      <Box>
                        <b>Balance:</b>&nbsp;
                        {parseFloat(Utils.formatUnits(
                          e.tokenBalance,
                          tokenDataObjects[i].decimals
                        )).toFixed(4)}
                      </Box>
                      <Image src={tokenDataObjects[i].logo} />
                    </Flex>
                  );
                })}
              </SimpleGrid>
            ) : (
              'Please make a query! This may take a few seconds...'
            )}
          </Flex>
        </Box>
  );
}

export default App;
