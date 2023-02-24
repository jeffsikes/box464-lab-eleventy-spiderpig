const EleventyFetch = require("@11ty/eleventy-fetch");
const md5 = require('md5');

const marvelCharacterStartsWith = process.env.MARVEL_CHARACTERS_NAME_STARTS_WITH;
const marvelPublicKey = process.env.MARVEL_PUBLIC_API_KEY;
const marvelPrivateKey = process.env.MARVEL_PRIVATE_API_KEY;

const currentDateTime = Date.now();

const hashValue = md5(currentDateTime + marvelPrivateKey + marvelPublicKey);


module.exports = async function() {
  try {
    let url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${marvelCharacterStartsWith}&limit=50&apikey=${marvelPublicKey}&ts=${currentDateTime}&hash=${hashValue}`

    // For learning experience, console directives allow for easier identification
    console.log("Searching the multiverse for your Marvel comic book character.");
    console.log(url);

    // https://developer.github.com/v3/repos/#get
    let json = await EleventyFetch(url, {
      duration: "*", // never fetch new data after the first success
      type: "json", // also supports "text" or "buffer"
      verbose: true,
      removeUrlQueryParams: true // our call to the Marvel API creates a unique hash every time it runs, so the cache will generate a new additional file on each run without this set.
    });

    // For learning experience, adding console directives 
    console.log("Marvel API call completed! Results have been stored in the .cache folder.");

    return json?.data?.results;
    } catch(e) {
    console.log("Something went wrong - the multiverse thread was destroyed.");
    return {};
  }
};