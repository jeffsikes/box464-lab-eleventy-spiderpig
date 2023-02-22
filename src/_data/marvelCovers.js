const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  try {
    const characterId = "1011347";
    const url = `https://gateway.marvel.com/v1/public/characters/${characterId}/comics?orderBy=onsaleDate&apikey=bb741a6ced934e0ca6a6db5912d6a6cb&ts=20230101&hash=57651ea717c2aff9598bc1a8018d6036`

    console.log("Did it get here")

    // https://developer.github.com/v3/repos/#get
    let json = await EleventyFetch(url, {
      duration: "1d", // only fetch once per day
      type: "json" // also supports "text" or "buffer"
    });

    return json?.data?.results;
    } catch(e) {
    console.log( "Failed getting Marvel Comic Covers, returning 0" );
    return {};
  }
};