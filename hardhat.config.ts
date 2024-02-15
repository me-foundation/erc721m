import 'dotenv/config';

import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import 'hardhat-watcher';
import { HardhatUserConfig, task, types } from 'hardhat/config';
import 'solidity-coverage';

import { deploy } from './scripts/deploy';
import { deployBA } from './scripts/deployBA';
import { mint } from './scripts/mint';
import { ownerMint } from './scripts/ownerMint';
import { setBaseURI } from './scripts/setBaseURI';
import { setCrossmintAddress } from './scripts/setCrossmintAddress';
import { setGlobalWalletLimit } from './scripts/setGlobalWalletLimit';
import { setMaxMintableSupply } from './scripts/setMaxMintableSupply';
import { setMintable } from './scripts/setMintable';
import { setStages } from './scripts/setStages';
import { setTimestampExpirySeconds } from './scripts/setTimestampExpirySeconds';
import { transferOwnership } from './scripts/transferOwnership';
import { setStartAndEndTimeUnixSeconds } from './scripts/setStartAndEndTimeUnixSeconds';
import { setMinContributionInWei } from './scripts/setMinContributionInWei';
import { sendRefund } from './scripts/sendRefund';
import { sendRefundBatch } from './scripts/sendRefundBatch';
import { sendTokensAndRefund } from './scripts/sendTokensAndRefund';
import { sendTokensAndRefundBatch } from './scripts/sendTokensAndRefundBatch';
import { setPrice } from './scripts/setPrice';
import { getPrice } from './scripts/dev/getPrice';
import { getStartTimeBA } from './scripts/dev/getStartTimeBA';
import { getEndTimeBA } from './scripts/dev/getEndTimeBA';
import { getMinContributionInWei } from './scripts/dev/getMinContributionInWei';
import { deployOnft } from './scripts/deployOnft';
import { setOnftMinDstGas } from './scripts/setOnftMinDstGas';
import { setTrustedRemote } from './scripts/setTrustedRemote';
import { sendOnft } from './scripts/sendOnft';
import { deployOwnedRegistrant } from './scripts/deployOwnedRegistrant';
import { getContractCodehash } from './scripts/dev/getContractCodehash';
import { deploy721BatchTransfer } from './scripts/dev/deploy721BatchTransfer';
import { send721Batch } from './scripts/send721Batch';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      url:
        process.env.GOERLI_URL || 'https://eth-goerli.api.onfinality.io/public',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      url:
        process.env.SEPOLIA_URL || 'https://ethereum-sepolia.publicnode.com',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: process.env.MAINNET_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL || 'https://rpc-mumbai.maticvigil.com/',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fuji: {
      url: process.env.FUJI_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || 'https://rpc.sepolia.org',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

task('setStages', 'Set stages for ERC721M')
  .addParam('contract', 'contract address')
  .addParam('stages', 'stages json file')
  .addOptionalParam('gaspricegwei', 'Set gas price in Gwei')
  .setAction(setStages);

task('setMintable', 'Set mintable state for ERC721M')
  .addParam('contract', 'contract address')
  .addParam('mintable', 'mintable state', 'true', types.boolean)
  .setAction(setMintable);

task('deploy', 'Deploy ERC721M')
  .addParam('name', 'name')
  .addParam('symbol', 'symbol')
  .addParam('maxsupply', 'max supply')
  .addParam('tokenurisuffix', 'token uri suffix', '.json')
  .addParam('globalwalletlimit', 'global wallet limit', '0')
  .addParam('timestampexpiryseconds', 'timestamp expiry in seconds', '300')
  .addOptionalParam(
    'cosigner',
    'cosigner address (0x00...000 if not using cosign)',
    '0x0000000000000000000000000000000000000000',
  )
  .addOptionalParam(
    'mintcurrency',
    'ERC-20 contract address (if minting with ERC-20)',
    '0x0000000000000000000000000000000000000000',
  )
  .addOptionalParam('autoapproveaddress', 'auto approve address')
  .addParam<boolean>(
    'increasesupply',
    'whether or not to enable increasing supply behavior', false,
    types.boolean,
  )
  .addParam<boolean>('pausable', 'whether to allow transfers to be paused', false, types.boolean)
  .addParam<boolean>('useoperatorfilterer', 'whether or not to use operator filterer', false, types.boolean)
  .addParam<boolean>(
    'openedition',
    'whether or not a open edition mint (unlimited supply, 999,999,999)',
    false,
    types.boolean,
  )
  .addOptionalParam<boolean>('useerc721c', 'whether or not to use ERC721C', true, types.boolean)
  .addOptionalParam<boolean>('useerc2198', 'whether or not to use ERC2198', true, types.boolean)
  .addOptionalParam('erc2198royaltyreceiver', 'erc2198 royalty receiver address')
  .addOptionalParam('erc2198royaltyfeenumerator', 'erc2198 royalty fee numerator')
  .setAction(deploy);

task('setBaseURI', 'Set the base uri')
  .addParam('uri', 'uri')
  .addParam('contract', 'contract address')
  .addOptionalParam('gaspricegwei', 'Set gas price in Gwei')
  .setAction(setBaseURI);

task('setCrossmintAddress', 'Set crossmint address')
  .addParam('contract', 'contract address')
  .addParam('crossmintaddress', 'new crossmint address')
  .setAction(setCrossmintAddress);

task('mint', 'Mint token(s)')
  .addParam('contract', 'contract address')
  .addParam('qty', 'quantity to mint', '1')
  .addParam('minttime', 'time of the mint')
  .setAction(mint);

task('ownerMint', 'Mint token(s) as owner')
  .addParam('contract', 'contract address')
  .addParam('qty', 'quantity to mint', '1')
  .addOptionalParam('to', 'recipient address')
  .setAction(ownerMint);

task('setGlobalWalletLimit', 'Set the global wallet limit')
  .addParam('contract', 'contract address')
  .addParam('limit', 'global wallet limit (0 for no global limit)')
  .setAction(setGlobalWalletLimit);

task('setMaxMintableSupply', 'set max mintable supply')
  .addParam('contract', 'contract address')
  .addParam('supply', 'new supply')
  .setAction(setMaxMintableSupply);

task('deployBA', 'Deploy BucketAuction')
  .addParam('name', 'name')
  .addParam('symbol', 'symbol')
  .addParam('maxsupply', 'max supply')
  .addParam('tokenurisuffix', 'token uri suffix', '.json')
  .addParam('globalwalletlimit', 'global wallet limit')
  .addOptionalParam(
    'cosigner',
    'cosigner address (0x00...000 if not using cosign)',
    '0x0000000000000000000000000000000000000000',
  )
  .addParam(
    'mincontributioninwei',
    'The minimum contribution in wei required only for the AuctionBucket',
  )
  .addParam('auctionstarttime', 'The start time of the bucket auction')
  .addParam('auctionendtime', 'The end time of the bucket auction')
  .addFlag('useoperatorfilterer', 'whether or not to use operator filterer')
  .setAction(deployBA);

task('setTimestampExpirySeconds', 'Set the timestamp expiry seconds')
  .addParam('contract', 'contract address')
  .addParam('timestampexpiryseconds', 'timestamp expiry in seconds')
  .setAction(setTimestampExpirySeconds);

task('transferOwnership', 'transfer contract ownership')
  .addParam('contract', 'contract address')
  .addParam('owner', 'new owner address')
  .setAction(transferOwnership);

task(
  'setStartAndEndTimeUnixSeconds',
  'set the start and end time for bucket auction',
)
  .addParam('contract', 'contract address')
  .addParam('starttime', 'start time of the bucket auction')
  .addParam('endtime', 'end time of the bucket auction')
  .setAction(setStartAndEndTimeUnixSeconds);

task('setMinContributionInWei', 'set the min contribution in wei for BA')
  .addParam('contract', 'contract address')
  .addParam('mincontributioninwei', 'min contribution in wei')
  .setAction(setMinContributionInWei);

task('sendRefund', 'send refund to the specified address for BA')
  .addParam('contract', 'contract address')
  .addParam('to', 'address to refund')
  .setAction(sendRefund);

task('sendRefundBatch', 'send refund to the specified addresses for BA')
  .addParam('contract', 'contract address')
  .addParam(
    'addresses',
    'path to the json file with an array of addresses to refund',
  )
  .setAction(sendRefundBatch);

task(
  'sendTokensAndRefund',
  'send tokens and refund the remaining to the specified address for BA',
)
  .addParam('contract', 'contract address')
  .addParam('to', 'address to refund')
  .setAction(sendTokensAndRefund);

task(
  'sendTokensAndRefundBatch',
  'send tokens and refund to the specified addresses for BA',
)
  .addParam('contract', 'contract address')
  .addParam(
    'addresses',
    'path to the json file with an array of addresses to refund',
  )
  .setAction(sendTokensAndRefundBatch);

task('getMinContributionInWei', 'get the min contribution in wei for BA')
  .addParam('contract', 'contract address')
  .setAction(getMinContributionInWei);

task('getStartTimeBA', 'get the start time of BA')
  .addParam('contract', 'contract address')
  .setAction(getStartTimeBA);

task('getEndTimeBA', 'get the end time of BA')
  .addParam('contract', 'contract address')
  .setAction(getEndTimeBA);

task('getPrice', 'get the price set for BA')
  .addParam('contract', 'contract address')
  .setAction(getPrice);

task('setPrice', 'set the price set for BA')
  .addParam('contract', 'contract address')
  .addParam('priceinwei', 'price in wei')
  .setAction(setPrice);

task('deployOnft', 'Deploy ERC721MOnft')
  .addFlag('ismintingcontract', 'whether or not this is a minting contract')
  .addParam('name', 'name')
  .addParam('symbol', 'symbol')
  .addParam('maxsupply', 'max supply')
  .addParam('tokenurisuffix', 'token uri suffix', '.json')
  .addParam('timestampexpiryseconds', 'timestamp expiry in seconds', '300')
  .addParam('globalwalletlimit', 'global wallet limit', '0')
  .addOptionalParam(
    'cosigner',
    'cosigner address (0x00...000 if not using cosign)',
    '0x0000000000000000000000000000000000000000',
  )
  .addOptionalParam(
    'mingastostore',
    'minimum gas to store default 15000',
    '15000',
  )
  .setAction(deployOnft);

task('setTrustedRemote', 'Set trusted remote for ERC721MOnft')
  .addParam(
    'sourceaddress',
    'the contract address you are setting the remote on',
  )
  .addParam('targetnetwork', 'the network you are setting the remote to')
  .addParam(
    'targetaddress',
    'the address of the contract on the target network',
  )
  .setAction(setTrustedRemote);

task('setOnftMinDstGas', 'Set min destination gas for ERC721MOnft')
  .addParam('contract', 'the contract address')
  .addParam('targetnetwork', 'the network you plan to send the tokens to')
  .addOptionalParam('packettype', 'package type. default to 1', '1')
  .addOptionalParam('mingas', 'min gas. default to 200000', '200000')
  .setAction(setOnftMinDstGas);

task('sendOnft', 'Send tokens to target network')
  .addParam('contract', 'the contract address you are sending tokens from')
  .addParam('targetnetwork', 'the network you are sending the tokens to')
  .addParam('tokenid', 'the token id you are sending')
  .addOptionalParam('tokenowner', 'the owner of the tokens')
  .addOptionalParam('refundaddress', 'the address you want to refund to')
  .addOptionalParam(
    'zeropaymentaddress',
    'the address you want to send a zero payment to',
  )
  .setAction(sendOnft);

task('deployOwnedRegistrant', 'Deploy OwnedRegistrant')
  .addParam('newowner', 'new owner address', '0x0000000000000000000000000000000000000000')
  .setAction(deployOwnedRegistrant);

task('getContractCodehash', 'Get the code hash of a contract')
  .addParam('contract', 'contract address')
  .setAction(getContractCodehash);

task('deploy721BatchTransfer', 'Deploy ERC721BatchTransfer')
  .setAction(deploy721BatchTransfer);

task('send721Batch', 'Send ERC721 tokens in batch')
  .addParam('contract', 'contract address')
  .addOptionalParam('transferfile', 'path to the file with the transfer details')
  .addOptionalParam('to', 'recipient address (if not using transferFile)')
  .addOptionalParam('tokenids', 'token ids (if not using transferFile), separate with comma')
  .setAction(send721Batch);

export default config;
