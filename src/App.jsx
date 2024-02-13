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


function App() {
  const [userAddress, setUserAddress] = useState('0x2ba708e0d7dd07e7f2e51d9e06a7a7a55b25d3cc');
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
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36} color={'blueviolet'}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Connect your wallet and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Text fontSize={25} fontFamily={'-moz-initial'} fontWeight={'bold'}>
          {isConnected? "Wallet Address: " + userAddress.substring(0, 5)+"......"+userAddress.substring(35) :"CONNECT YOUR WALLET"}
        </Text>
        <Button fontSize={20} onClick={connectWallet} mt={36} bgColor="red">
        {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
      </Button>
        <Button fontSize={20} onClick={handleClick} mt={36} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>
        <Text>{isloading? "loading.....": ''}</Text>
        <Heading my={36}>ERC-20 token balances:</Heading>

        {hasQueried ? (
          <SimpleGrid w={'95vw'} columns={3} spacing={24}>
            {results.tokenBalances.map((e, i) => {
              return (
                <Flex
                  flexDir={'column'}
                  color="white"
                  bg="blue"
                  w={'20vw'}
                  h={'23vw'}
                  p={'0.5vw'}
                  key={i}
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
