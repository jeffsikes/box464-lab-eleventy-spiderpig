# Learning Lab
## Eleventy with cached API content

> Date Published: February 23, 2023

> Prerequisite Skills: Basics of Eleventy; Markdown; Nunjuks

This lab demonstrates how to utilize the @eleventy/eleventy-fetch plugin to retrieve data from an API into your Eleventy generated site.

It will call the Marvel API, retrieve the most recent 75 comic book covers for a specific character, and display them on an HTML page.

You can see the example here: [Peter Porker, the amazing Spider-Ham](https://spider-ham.box464.com).

If you just want to download this project and see the results - you absolutely can if you know how to pull down a repository from GitHub. 

# Just show me the spider-pig!

The following technologies are utilized for this build. All are open source or free tier. I'll walk through the installation of the Marvel Dev account. The others will be installed during the build.

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

Eleventy provides a plugin called @eleventy/eleventy-fetch (previously called @eleventy/eleventy-feed) that will fetch data from an API and then store it locally. The neat part is that it has the capability to CACHE the data for any length of time you want. So, you can significantly reduce the number of API calls you are making to your services. Which is especially great when you are charged for each API transaction.

Let's get started!
# Marvel Developer Portal
Create a new login or login to your existing [Marvel account](https://www.marvel.com/signin?referer=https%3A%2F%2Fdeveloper.marvel.com%2Faccount). If you are creating a new account, be sure to un-tick all the email opt-ins.

Once your account is created, you can go to your [developer account page](https://developer.marvel.com/account) and see your public and private keys. 

You'll need both of these for the lab.

A note here, because we are using this API from our local dev boxes, we can't provide a domain name for an authorized referrer. This requires us to do a bit more work to create a token and a hashed value to pass to the API.

If you were setting up a client side application using React or Vue, you could add your domain to the authorized referrer list to make client API calls without having to create a hash.

You can pull down whatever data you want, as long as you follow these guidelines:

1) Only make up to 3,000 API calls per day (thanks to eleventy-fetch, we only make 1 per WEEK!)
2) Each entity (in our case, comic cover) should link back to the associated Marvel page.
3) You must display an attribution on the page

`Data provided by <a href="https://marvel.com">Marvel</a>. @ 2014 Marvel`

There's lots of [fine print](https://developer.marvel.com/documentation/attribution), but if you stick to the layout in this lab, the above will suffice. 

One of the things they recommend, but not required, is to NOT store the data for long periods of time, because it's likely their image storing location will change, etc.

Since this is a lab exercise, I'm assuming you're not setting up a new Marvel Universe store with all the content. Even if you did, tho, you could just setup a continuous build to update every week or so and be fine.

# Let's Go!
## Ignoring the right things
Create a .gitignore file if one hasn't already been created at the root of your project.

Add the following items to the file to ensure the node_modules, .env file and .cache directory are excluded from the repository when committed.

**.gitignore**
```
node_modules
.env
.cache
```
## Creating .env variables
An .env file is utilized to keep data out of your inline code. These variables can then be transferred into key/value pairs in your deployments to Netlify, so they are never part of the code that gets stored or shown in your repository.

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

My favorite character is Spider-Ham, so the default return will be that character id of 1011347.

Not a Spider-Ham fan? Find [your own favorite Spider in the Spiderverse](https://spider-ham.box464.com/characters), and copy the Marvel Character Id. 

Change the .env variable for "MARVEL_CHARACTER_ID" to your preferred character id.

If you have previously run this request with the Spider-Ham character, you'll need to remove the cached data from the .cache file (just delete all the files in the folder).

Then run the build again.

# Install Packages
There are a few packages to install first.

```
npm install
```

Once that completes, you're ready to go.

```
npm start
```

This should start up a local server in your environment, as well as pull the comic book cover data from the API.

Congratulations! You comic book covers should be displaying.

# How does it work?
That's the magic of @eleventy-fetch. It's a wrapper around a simple javascript fetch request, but it has some interesting features. The content it returns is stored in the .cache folder by default, and the content can be configured to be cached for specific periods of time - it won't make the API call each time you do a build, only after the expiration date on the cache has passed. Neat! 

Here's the call and the configuration I've set by default for this lab.

This can be found in /src/_data/marvelCovers.js

```
let json = await EleventyFetch(url, {
      duration: "1w", // only fetch new data after 1 week 
      type: "json", // also supports "text" or "buffer"
      removeUrlQueryParams: true 
    });
```

The duration can be set as you wish from never after first pull to every 5 seconds. I doubt Spider-Ham data is going to change much, so I could set this to 365 days if I wanted.

By setting a longer cache duration, we don't get dinged by the Marvel Developer API for a transaction on every build. [It can be setup](https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration) to only rebuild the data once the content is older than a day, a week, a year, or 15 seconds or even never after the first pull. It's up to you!

Remember, you have a daily limit on API calls to Marvel Comics of 3,000. Especially as you begin playing with the API data, it's very useful to have a cached version so it doesn't get called every time you do a new build to test.

Note the `removeUrlQueryParams` value. 

Because our API call is built with a token and hashed value, the API querystring changes on each call. 

```https://gateway.marvel.com/v1/public/characters/1011347/comics?orderBy=onsaleDate&apikey=fkdkkki0023kkss&ts=20230223T00:00:00&hash=alskjajklawejklajdsf```

@eleventy-fetch sees each of these as unique API calls and will store them separately due to the changing querystring. 

To ensure we don't keep creating duplicate data files, setting this to true forces the plugin to ignore the parameters and eliminate the possible duplicate data files.

# Reference Material
* https://www.11ty.dev/docs/plugins/fetch/
* https://picocss.com/docs/
* https://developer.marvel.com/documentation/authorization
* https://github.com/motdotla/dotenv
* https://github.com/pvorb/node-md5
* https://github.com/jakejarvis/netlify-plugin-cache

