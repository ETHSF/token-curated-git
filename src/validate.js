const tokenCuratedGitAbi = require("../../app/build/contracts/TokenCuratedGit.json")
const tcgConfig = require("../../tcg-config.json")

const Web3 = require("web3")
const web3 = new Web3(new web3.providers.HttpProvider('http://localhost:8545'))

const tokenCuratedGit = new web3.eth.Contract(tokenCuratedGitAbi, tcgConfig.tokenCuratedGitAddress)

// const listenForApprovalOfHash = (approvedGitHash) => {

tokenCuratedGit.events.Approve({
    filter: {gitHash: approvedGitHash}
})
    .on('data', (event) => {
        console.log("Approval of git hash " + approvedGitHash + " confirmed")
        console.log(event)
    })
    .on('changed', (event) => {
        console.log("Approval of git hash" + approvedGitHash + " reverted")
        console.log(event)
    })
    .on('error', console.error);
// }
