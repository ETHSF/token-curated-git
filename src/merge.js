import initAragonJS from './aragonjs-wrapper'


const tryFindTransactionPath = async () => {
  if (appsLoaded && wrapper) {
    ctx.transactionPath = await getTransactionPath(wrapper)

    let tx = ctx.transactionPath[0]

    if (!tx) {
      throw new Error('Cannot find transaction path for executing action')
    }

    const estimatedGas = await web3.eth.estimateGas(ctx.transactionPath[0])
    tx.gas = parseInt(GAS_ESTIMATE_FUZZ_FACTOR * estimatedGas)
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction(ctx.transactionPath[0],(err,res) => {
        if(err){
          reject(err)
          return
        }
        ctx.res = res
        resolve()
      })
    })
  }
}

initAragonJS(dao, apm['ens-registry'], {
  accounts: ctx.accounts,
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
