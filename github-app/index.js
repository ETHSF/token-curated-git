// A plugin is a Node module that exports a function which takes a `robot` argument
module.exports = robot => {
  console.log("- hits robot");
  // Listen for a pull request being opened or synchronized
  robot.on('pull_request', async (event, context) => {
    // Just assign a variable to make our life easier
    const pr = event.payload.pull_request;

    // Get all the commits in the pull request
    const compare = await context.github.repos.compareCommits(context.repo({
      base: pr.base.sha,
      head: pr.head.sha
    }));

    // Check that every commit has the word bananas in it
    const isBananas = compare.commits.every(data => {
      return data.commit.message.match(/bananas/i);
    });

    // Parameters for the status API
    const params = {
      sha: pr.head.sha,
      context: 'bananas',
      state: isBananas ? 'success' : 'failure',
      description: `Your commits ${isBananas ? 'are' : 'need more'} bananas`
    }

    // Create the status
    return context.github.repos.createStatus(context.repo(params));
  });

};
