const EleventyFetch = require("@11ty/eleventy-fetch");

const comicVineApiKey = process.env.COMICVINE_API_KEY;
const characterId = process.env.COMICVINE_CHARACTER_ID;

module.exports = async function() {
  try {
    // First, get the character details which includes issue_credits
    let characterUrl = `https://comicvine.gamespot.com/api/character/4005-${characterId}/?api_key=${comicVineApiKey}&format=json&field_list=issue_credits`;

    console.log("Fetching character details from ComicVine...");
    console.log(characterUrl);

    let characterData = await EleventyFetch(characterUrl, {
      duration: "1w",
      type: "json",
      verbose: true
    });

    // Get the issue IDs from the character's issue credits
    const issueIds = characterData?.results?.issue_credits?.map(issue => issue.id) || [];

    if (issueIds.length === 0) {
      console.log("No issues found for this character.");
      return [];
    }

    // Limit to first 50 issues
    const limitedIssueIds = issueIds.slice(0, 50).join('|');

    // Now fetch the details for these specific issues
    let issuesUrl = `https://comicvine.gamespot.com/api/issues/?api_key=${comicVineApiKey}&format=json&filter=id:${limitedIssueIds}&sort=cover_date:desc&field_list=id,name,volume,cover_date,image,site_detail_url`;

    console.log("Fetching issue details from ComicVine...");

    let issuesData = await EleventyFetch(issuesUrl, {
      duration: "1w",
      type: "json",
      verbose: true
    });

    console.log("Eleventy-Fetch completed! Results have been added or retrieved from the .cache folder.");

    return issuesData?.results || [];
  } catch(e) {
    console.log("Something went wrong - couldn't fetch ComicVine data.");
    console.log(e);
    return [];
  }
};
