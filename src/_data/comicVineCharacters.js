const EleventyFetch = require("@11ty/eleventy-fetch");

const comicVineApiKey = process.env.COMICVINE_API_KEY;
const characterName = process.env.COMICVINE_CHARACTER_NAME;

module.exports = async function() {
  try {
    // ComicVine API search endpoint for characters
    let url = `https://comicvine.gamespot.com/api/search/?api_key=${comicVineApiKey}&format=json&query=${encodeURIComponent(characterName)}&resources=character&limit=50&field_list=id,name,real_name,image,site_detail_url,deck`;

    console.log("Searching ComicVine for comic book characters.");

    // https://www.11ty.dev/docs/plugins/fetch/
    let json = await EleventyFetch(url, {
      duration: "*", // never fetch new data after the first success
      type: "json", // also supports "text" or "buffer"
      verbose: false
    });

    // For learning experience, adding console directives
    console.log("ComicVine API call completed! Results have been stored in the .cache folder.");

    // ComicVine returns data in results array
    return json?.results || [];
    } catch(e) {
    console.log("Something went wrong - couldn't fetch ComicVine data.");
    console.log(e);
    return [];
  }
};
