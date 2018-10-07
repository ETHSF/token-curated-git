import initAragonJS from './helpers/aragonjs-wrapper'

var fs = require("fs");
var web3 = require('web3');

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
  reporter.error('Error inspecting DAO')
  reporter.debug(err)
  process.exit(1)
})


const tryFindTransactionPath = async () => {
  if (appsLoaded && wrapper) {
    ctx.transactionPath = await wrapper.getTransactionPath(tcgConfig.tokenCuratedGitAddress,"approve",[commitHash,"0x00"])

    let tx = ctx.transactionPath[0]

    if (!tx) {
      throw new Error('Cannot find transaction path for executing action')
    }

    const estimatedGas = await web3.eth.estimateGas(ctx.transactionPath[0])
    tx.gas = parseInt(GAS_ESTIMATE_FUZZ_FACTOR * estimatedGas)
    await web3.eth.sendTransaction(ctx.transactionPath[0])
  }
}
