const EleventyFetch = require("@11ty/eleventy-fetch");
const md5 = require('md5');

const marvelPublicKey = process.env.MARVEL_PUBLIC_API_KEY;
const marvelPrivateKey = process.env.MARVEL_PRIVATE_API_KEY;
const characterId = process.env.MARVEL_CHARACTER_ID;

const currentDateTime = Date.now();

const hashValue = md5(currentDateTime + marvelPrivateKey + marvelPublicKey);


module.exports = async function() {
  try {
    let url = `https://gateway.marvel.com/v1/public/characters/${characterId}/comics?orderBy=onsaleDate&limit=50&apikey=${marvelPublicKey}&ts=${currentDateTime}&hash=${hashValue}`

    // For learning experience, console directives allow for easier identification
    console.log("Searching the multiverse for your Marvel comic book character.");
    console.log(url);

    // https://developer.github.com/v3/repos/#get
    let json = await EleventyFetch(url, {
      duration: "1w", // never fetch new data after the first success
      type: "json", // also supports "text" or "buffer"
      verbose: true,
      removeUrlQueryParams: true // our call to the Marvel API creates a unique hash every time it runs, so the cache will generate a new additional file on each run without this set.
    });

    // For learning experience, adding console directives 
    console.log("Eleventy-Fetch completed! Results have been added or retrieved from the .cache folder.");

    return json?.data?.results;
    } catch(e) {
    console.log("Something went wrong - the multiverse thread was destroyed.");
    return {};
  }
};