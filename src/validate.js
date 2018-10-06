const tokenCuratedGitContract = require("../app/build/contracts/TokenCuratedGit.json")
// const tcgConfig = require("../../tcg-config.json")

const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

const tokenCuratedGit = new web3.eth.Contract(tokenCuratedGitContract.abi, "0x4E4a2B89Ea27338D323C0dCA22b1ffbA62db1177")

let commitHash = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim()

commitHash = "0x" + commitHash

tokenCuratedGit.events.Approve({
    filter: {gitHash: commitHash}
})
    .on('data', (event) => {
        console.log("Approval of git hash " + event.returnValues.gitHash + " confirmed")
    })
    .on('changed', (event) => {
        console.log("Approval of git hash" + event.returnValues.gitHash + " reverted")
    })
    .on('error', console.error)
