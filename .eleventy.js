const util = require('util');
const { DateTime } = require('luxon');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/style.css");
    eleventyConfig.addPassthroughCopy("./src/peter_porker.png");
    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromISO(dateObj).toLocaleString(DateTime.DATE_MED);
    });
    eleventyConfig.addFilter("first100", (stringObj) => {
        return stringObj.slice(0, 1);
    });
    eleventyConfig.addFilter('dump', obj => { 
        return util.inspect(obj)
    })
    return {
        dir: {
            input: "src",
            output: "public",
            cache: ".cache",
        },
    };
};