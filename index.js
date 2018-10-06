// A plugin is a Node module that exports a function which takes a `robot` argument
module.exports = robot => {

 // robot.on('pull_request', async (event, context) => {
    robot.on('pull_request.opened', async context => {

    // Just assign a variable to make our life easier
    const pr = context.payload.pull_request;
    console.log(context);
    console.log(pr);
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
