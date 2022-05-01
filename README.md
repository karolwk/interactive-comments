# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)

## Overview

Pratice project to build interactive comment section. Technologies used: React with Typescript.

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
- **Bonus**: Instead of using the `createdAt` strings from the `data.json` file, try using timestamps and dynamically track the time since the comment or reply was posted.

### Links

- Live Site URL: [https://karolwk.github.io/interactive-comments/](https://karolwk.github.io/interactive-comments/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- TypeScript
- [React](https://reactjs.org/) - JS library
- [LocalForage](https://localforage.github.io/localForage/) - JS library for handling offline data storage

### What I learned

After a lot of small projects I wrote in TypeScript and React, this one was first "bigger one". It was quite challenging to put it to motion, but it also was a good pratice with TypeScript, LocalStorage and working with API with mocked JSONServer.

### Continued development

I had some problems with state floating around components, mainly because I didn't use any global state solutions like Redux od Context System. In future projects I will surly give them a try.
