# Learning Lab

![Peter Porker, the Amazing Spider-Ham](src/peter_porker.png)
## Eleventy with cached API content using eleventy-fetch

Compare this lab to this README.md and edit
https://github.com/11ty/eleventy-base-blog

> Date Published: February 23, 2023

This lab demonstrates how to utilize the @eleventy/eleventy-fetch plugin to retrieve data from an API and use it in an Eleventy generated site.

It will call the Marvel API, retrieve the most recent 75 comic book covers for a specific character, and display them on an HTML page.

You can see the example here: [Peter Porker, the amazing Spider-Ham](https://spider-ham.box464.com).

# Marvel Developer Portal
You'll need a Marvel Developer account. Create a new login or login to your existing [Marvel account](https://www.marvel.com/signin?referer=https%3A%2F%2Fdeveloper.marvel.com%2Faccount). If you are creating a new account, **be sure to un-tick all the email opt-ins**.

Once your account is created, you can go to your [developer account page](https://developer.marvel.com/account) and see your public and private keys. 

You'll need both of these for the lab.

![Authorized Referrer Urls](/src/readme_images/marvel-developer-key.png)

Because we are using this API from our local dev boxes, we can't provide a domain name for Marvel's authorized referrer url list. If we were building a client side javascript app and were calling the API from a browser, we would only need the public key and add our domain name to the list. 

![Authorized Referrer Urls](/src/readme_images/marvel-authorized-url.png)

This requires us to do a bit more work to [create a token and a hashed value](https://developer.marvel.com/documentation/authorization) to pass to the API. Don't worry! You just need the keys, and the code takes care of the rest if you aren't interested in how it works.

You can pull down whatever data you want, as long as you follow these guidelines:

1) Only make up to 3,000 API calls per day (thanks to eleventy-fetch, we only make 1 per WEEK!)
2) Each entity (in our case, comic cover) should link back to the associated Marvel page.
3) You must display an attribution on the page

`Data provided by <a href="https://marvel.com">Marvel</a>. @ 2014 Marvel`

There's lots of [fine print](https://developer.marvel.com/documentation/attribution), but if you stick to the layout in this lab, the above will suffice. 

One of the things they **recommend**, but not required, is to refresh your data store often, because it's likely their image storing location will change, etc.

# Ignoring things
Create a .gitignore file if one hasn't already been created at the root of your project.

Add the following items to the file to ensure the node_modules, .env file and .cache directory are excluded from the repository when committed.

**.gitignore**
```
node_modules
.env
.cache
```
## Creating .env variables
An .env file is utilized to keep data out of your inline code. These variables can then be transferred into key/value pairs in your deployments to Netlify, if you're going that route, so they are never part of the code that gets stored or shown in your repository.

**Be sure to add .env to your .gitignore file.**

Create an .env file at the root of this project, and add the following lines:

**.env**
```
MARVEL_CHARACTERS_NAME_STARTS_WITH=Spider
MARVEL_CHARACTER_ID=[MARVEL_CHARACTER_ID] 
MARVEL_PUBLIC_API_KEY=[YOUR_MARVEL_PUBLIC_API_KEY]
MARVEL_PRIVATE_API_KEY=[YOUR_MARVEL_PRIVATE_API_KEY]
```

These values will be used to call the API and return the most recent 50 comic book covers for that character.

My favorite character is Spider-Ham, so for him, use a MARVEL_CHARACTER_ID of 1011347.

Not a Spider-Ham fan? Find [your own favorite Spider in the Spiderverse](https://spider-ham.box464.com/characters), and copy the Marvel Character Id. 

Change the .env variable for "MARVEL_CHARACTER_ID" to your preferred character id.

# Install Packages
There are a few packages to install first.

```
npm install
```

Then build it to get the cached data.
```
npm build
```

Once that completes, you're ready to go!

```
npm start
```

This should start up a local server in your environment, as well as pull the comic book cover data from the API.

> If you have previously run this request with the Spider-Ham character, you'll need to remove the cached data from the .cache file (just delete all the files in the folder). Then run the build again.

Congratulations! You comic book covers should be displaying.

![Spider-Ham Comic Book Covers](src/readme_images/marvel-spider-ham-covers.png)

# How does it work?
That's the magic of @eleventy/eleventy-fetch. It's a wrapper around a simple javascript fetch request, but it has some interesting features. The content it returns is stored in the .cache folder by default, and the content can be configured to be cached for specific periods of time - it won't make the API call each time you do a build, only after the expiration date on the cache has passed. Neat! 

Here's the call and the configuration I've set by default for this lab.

This little magic bit can be found in /src/_data/marvelCovers.js

```
let json = await EleventyFetch(url, {
      duration: "1w", // only fetch new data after 1 week 
      type: "json", // also supports "text" or "buffer"
      removeUrlQueryParams: true 
    });
```

Let's talk about each parameter here.
## Duration
The duration can be set as you wish from never after first pull to every 5 seconds. I doubt Spider-Ham data is going to change much, so I could set this to 365 days if I wanted.

By setting a longer cache duration, we don't get dinged by the Marvel Developer API for a transaction on every build. [It can be setup](https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration) to only rebuild the data once the content is older than a day, a week, a year, or 15 seconds or even never after the first pull. It's up to you!

Remember, you have a daily limit on API calls to Marvel Comics of 3,000. Especially as you begin playing with the API data, it's very useful to have a cached version so it doesn't get called every time you do a new build to test.

> One thing I wish was clearer when running the plugin is a message indicating if the data was pulled from cache or updated from the API, and how much time is left before the cache expires.

## Type
Simply, you could return plain text, an image stream, etc. We're keeping it simple here and leaving it as good old json.

## RemoveUrlQueryParams
Note the `removeUrlQueryParams` value. 

Because our API call is built with a token and hashed value, the API querystring changes on each call. 

```https://gateway.marvel.com/v1/public/characters/1011347/comics?orderBy=onsaleDate&apikey=[fakeApiKey]&ts=20230223T00:00:00&hash=alskjajklawejklajdsf```

returns the same results as:

```https://gateway.marvel.com/v1/public/characters/1011347/comics?orderBy=onsaleDate&limit=50&apikey=[fakeApiKey]&ts=1677295853241&hash=ae2ioijaashasdfasdf```

**but the query string is different due to the hashed values!**

@eleventy-fetch sees each of these as unique API calls and will store them as separate results due to the changing query string. 

To ensure we don't keep creating duplicate data files, setting this to true forces the plugin to ignore the parameters and eliminate the possible duplicate data files.

With this set, eleventy-fetch stores results from `https://gateway.marvel.com/v1/public/characters/1011347/comics` as a single cached result, ignoring the hashed query string values that change on each call.

# Where does the data go?
I admit at first I wasn't clear where the data was getting stored once it was returned. By default, a .cache folder will be created at the root of your project. Check there, and you should see 4 files.

We are actually making two API calls, one to grab all Marvel Characters that start with the term "Spider", and then another to grab our favorite Spider-person.

Each call creates two files.
# Cache MetaData File
This file contains information about the cached content in json format.

* Reference to the cached file name
* A cached date and time
* A "type" - which I honestly don't know what magic it is referring to
* And then finally the format - in our case, json

# Data File
The second file name matches the name referenced in the metadata file.

It contains the data as returned from the function.

# Build Dependencies
The following technologies are utilized for this build. All are open source or free tier. The others will be installed during the build.

* [Marvel Developer API](https://developer.marvel.com/) (requires account, but free)
* [Eleventy](https://www.11ty.dev/)
* [Eleventy Plugin: @eleventy/eleventy-fetch](https://www.11ty.dev/docs/plugins/fetch/)
* [Nunjuks Templating Language](https://mozilla.github.io/nunjucks/templating.html)
* [Markdown Language](https://www.markdownguide.org/)
* [Pico CSS](https://picocss.com/)
* [Dotenv](https://github.com/motdotla/dotenv)
* [MD5 hashing](https://github.com/motdotla/dotenv)

I recommend trying out [continuous deployment](https://dev.to/michaelburrows/deploy-a-static-eleventy-11ty-site-from-github-to-netlify-57ho) as an additional practice, but it's not necessary to complete the lab.

* [A GitHub Account](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) to store your code
* [A Netlify Account](https://www.netlify.com/) to publish your code
* [Netlify Cache Plugin](https://github.com/jakejarvis/netlify-plugin-cache)

## Concepts to understand
Eleventy builds static websites, meaning, it generates HTML based on data and templates created through this code. There is no backend server to pull information from a database once the site is deployed. 

Eleventy provides a plugin called [@eleventy/eleventy-fetch](https://www.11ty.dev/docs/plugins/fetch/) (previously called @eleventy/eleventy-cache-assets) that will fetch data from an API and then store it locally. The neat part is that it has the capability to CACHE the data for any length of time you want. So, you can significantly reduce the number of API calls you are making to your services. Which is especially great when you are charged for each API transaction.

# Reference Material
* https://www.11ty.dev/docs/plugins/fetch/
* https://picocss.com/docs/
* https://developer.marvel.com/documentation/authorization
* https://github.com/motdotla/dotenv
* https://github.com/pvorb/node-md5
* https://github.com/jakejarvis/netlify-plugin-cache

