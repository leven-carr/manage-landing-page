# Frontend Mentor - Manage landing page solution

This is a solution to the [Manage landing page challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/manage-landing-page-SLXqC6P5). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the site depending on their device's screen size
- See hover states for all interactive elements on the page
- See all testimonials in a horizontal slider
- Receive an error message when the newsletter sign up `form` is submitted if:
  - The `input` field is empty
  - The email address is not formatted correctly

### Links

- Solution URL: [View code on GitHub](https://github.com/leven-carr/manage-landing-page)
- Live Site URL: [Vercel Live Site](https://leven-carr-manage.vercel.app/)

## My process

### Built with

- HTML, including the `<template>` element and the modal `<dialog>` element
- Tailwind CSS v4
- Vanilla JavaScript, including fetch API

### What I learned

This project represented a significant step for me in terms of scale, technical difficulty, and workflow due to my shift to self-hosting assets such as fonts. It was also my first time using Tailwind, which I did with the Tailwind CLI. I also setup the Prettier plug-in to organize the Tailwind class names for me in the HTML.

In previous projects, my workflow had relied on linking to external assets like Google Fonts, Font Awesome, etc. This time, I wanted to focus on a more professional workflow that made use of self-hosting and build tools rather than externally linking. I stored the Google Font and the Font Awesome library in my file structure, and learned how to install the Tailwind CLI as a development dependency. I learned a little bit about the different file types for fonts, notably that woff2 is the best choice due to their smaller footprint and universal compatibility with modern browsers. That being said the specified font for this project was only available as ttf, and its design has also actually been altered since Frontend Mentor implemented this project so it looks a little different.

Fundamentally this project didn't really hold anything brand new for me in terms of HTML (other than writing all those Tailwind classes), however, this was by far the biggest project I have attempted. The other projects I have worked on up to this point were basically equivalent to just one section of this page, so there was a greater degree of structure and organization to keep in mind. The thing I struggled with the most in that regard was consistency; as I was building the page and writing the Tailwind styles, my approach changed throughout so it was a little difficult to keep track of and required a lot of back-tracking to ensure that I had taken a reasonably uniform approach to the design and application of styles throughout.

I did not enjoy using Tailwind in place of Vanilla CSS as much as I thought I would. I understand the advantage of using a library such as Tailwind; it's more conducive to collaboration because everyone can pull from a standardized set of styling classes, rather than trying to track eachother's custom rules, but the sheer amount of bulk that it adds to the HTML is going to take some getting used to. Adding the Prettier plug-in to organize classes helped some, but for now I still find it less readable than a plain old CSS file.

For the script, there were some things that I felt pretty comfortable figuring out on my own (although I still needed help with optimizing it), but there were also some things that I was completely lost on. My script consists of three main sections: the mobile menu, the signup form, and the carousel. Of the three, the signup form was by far the most simple, and I added a success modal for some more polish.

The mobile menu was a little more frustrating, not so much due to the complexity of the script as due to my confusion on how best to structure it. Originally I had just one mobile menu in the HTML, but it quickly became apparent that trying to convert the same elements between mobile and desktop functionality was more trouble than it was worth. I don't love that I had to repeat myself in the HTML and write two menus, but ultimately I felt like the functional ease of that approach outweighed the repetition. I considered using a `<dialog>` element for the menu, as that includes baked-in JS methods for opening and closing as well as an easily styled backdrop, but I decided not to do that for a couple reasons. For one thing, it doesn't quite fit semantically; a nav menu is not a popup dialog. Secondly, it wouldn't work cleanly anyway because the button for the dialog had to be inside the dialog, therefore, it wouldn't have been present in order to open it. Obviously I could have created a second, outer button for opening it and tried to style it in a way that created the illusion that the inner, closing button was the same, but that would have felt like a messy hack. In the end I created a modal from scratch using divs and custom script to open and close the menu and backdrop, update the requisite accessibility attributes accordingly, and handle the focus trap for keyboard navigability.

The carousel was the part of the script where I just didn't even know where to begin and relied heavily on generative AI to write the code and explain it to me. I had no trouble with using the fetch API for populating the testimonials and did that part independently, as I had done something similar before, but the styling and looping of the carousel were brand new to me. I spent a long time trying to finagle an infinite looping carousel, and did have one that worked, but it was not very polished and bloated the script considerably. Ultimately I switched to a non-looping slider. The script is much cleaner, and while I still needed help to write it (it makes use of an observer, which is not something I have encountered before) I feel like I understand it better than what I was trying to wrap my head around with the from-scratch, vanilla infinite carousel.

### Continued development

My next step is to start learning React; I've done several projects with Vanilla JS at this point and am running into things, like the carousel, that are pretty complex without a framework. I also want to get Vite setup and understand the role that it plays in compiling my projects.

### Useful resources

- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet) - This was a great resource for helping me find the right Tailwind classes to use, as this was my first time using Tailwind.
- [MDN Web Docs Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#see_also) - This is a good intro into what an intersection observer is.

### AI Collaboration

I used Gemini to help me figure out the code for the slider; in the previous project where I relied on generative AI help I actually felt like I learned a lot, but I found that the carousel in this project was apparently too complex to get clear, consistent input from Gemini. It did help me write the code using the observer, but the conflicting and bloated recommendations when I was attempting the infinite carousel were more frustrating than helpful.

## Author

- Frontend Mentor - [@leven-carr](https://www.frontendmentor.io/profile/leven-carr)
- GitHub - [@leven-carr](https://github.com/leven-carr)
