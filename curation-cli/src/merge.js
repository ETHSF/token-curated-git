import initAragonJS from './helpers/aragonjs-wrapper'

var fs = require("fs");
var wrapper;
var appsLoaded;

const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

var tcgConfig=fs.readFileSync("tcg-config.json", "utf8");
tcgConfig = JSON.parse(tcgConfig);

const commitHash = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim()

initAragonJS(tcgConfig.dao, tcgConfig.ens, {
  accounts: web3.accounts,
  provider: web3.currentProvider,
  onApps: async apps => {
    appsLoaded = true
    await tryFindTransactionPath()
  }
})
.then(async (initializedWrapper) => {
  wrapper = initializedWrapper
  await tryFindTransactionPath()
})
.catch(err => {
  console.log(err)
  //reporter.error('Error inspecting DAO')
  //reporter.debug(err)
  ////process.exit(1)
})

function makeItThirtyTwo(str) {

}

const tryFindTransactionPath = async () => {
  if (appsLoaded && wrapper) {
   var transactionPath = await wrapper.getTransactionPath(tcgConfig.tokenCuratedGitAddress,"approve",["0x" + commitHash,"0x0000000000000000000000000000000000000000"])

    let tx = transactionPath[0]

    if (!tx) {
      throw new Error('Cannot find transaction path for executing action')
    }

    const estimatedGas = await web3.eth.estimateGas(transactionPath[0])
    tx.gas = parseInt(GAS_ESTIMATE_FUZZ_FACTOR * estimatedGas)
    await web3.eth.sendTransaction(transactionPath[0])
  }
}
