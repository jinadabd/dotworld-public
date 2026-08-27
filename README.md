# dotworld

A community-led non-algorithmic social platform centered around self-expression, human connection, and creation over consumption.

[Live](https://dotworld-u07a.onrender.com)

## Introduction (A short essay)
dotworld started out as a simple question: **Why does tech no longer feel cool?**  
At first, I assumed the answer was mere nostalgia: I'm just another zoomer yearning for aesthetics of the early 2000s. But upon examining what aspects I felt nostalgic towards, I realized it was much more complex than that. The revival of physical media such as CDs and vinyls, the resurgence of digicams and film, the return of collectibles and charms and other small 'useless' personal items that serve no purpose beyond sentimentality and identity.  
And while this physical reality forms, the digital space, rather than evolve and adapt to answer to those needs, has departed completely from any remaining aspect that has previously kept it grounded: wide-scale adoption of generative AI, terrifyingly-accurate algorithmic recommendation of consumed content, favouring performance over authenticity, and a degradation of empathy and connection that is currently being advertised as curation.  
The answer, it turns out, is a visceral human reaction to those developments: **Friction**.  
Our devices and applications have become too convenient, too easy to use. Social media is engineered to be frictionless. dotworld, on the other hand, intentionally creates friction between the user and the service. I believe it is this very friction that causes me to pick up my film camera instead of my phone when I want to take a picture, even if that means I will wait at least a month before I actually see the photo. It is the same inconvenience I experience in the car when I put on a CD rather than play my favourite tracks via Bluetooth.  
I captured this physical friction and translated it into a digital experience. All profiles are locked by default. There are no algorithms to provide you of an accurate description of your current emotional state, or the jokes you find the most funny, or a compilation of cute cat videos; that is your work as a user, and it can be achieved through the connections you make and the creations you and others build on the platform. Everything is chronological, and everything you create is yours.  
I hope you like it, and I wish for dotworld to become a place you can call a digital home :) 

## About 
dotworld is a social platform aimed at creating a a digital space for its users beyond the algorithmic recommendations and engineered distractions we are used to experiencing on mainstream social media platforms. It encourages users to build and customize their online space, and express themselves through sharing their hobbies and interests with their friends or the community at large.

## Features
### Authentication
- Registration
- Authentication via email/username and password
- Logging in and out
- Secure authentication and session management using JWT

### Islands
- Creating and customizing your Island
- Private by default, but you can change its visibility
- Seeing your own Chatter and Trinkets on your Island

### Trinkets
- Creating and customizing your Trinkets
- Private by default, but can be shared with Friends and the Community
- Seeing your Friends' Trinkets, and the Community Trinkets
- Adding items to your Trinkets, such as photos to a Gallery, music to a Playlist, or reviews, logs, and more to Collections

### Friends
- Find Friends via their username, or through Community Trinkets
- See your Friends' Islands, Trinkets, and Chatter
- Accept or decline Friendship requests, or edit your current of pending Friendships

### Chatter
- Share your thoughts, updates, or photos to your Chatter
- By default, your Chatter is visible to Friends, but you can make it private
- See your Friends' Chatter chronologically, and mark it as read to clear your unread tab
- Chatter is paginated in order to foster a mindful and intentional interaction rather than an infinite scroll

### Real-Time Interaction
- Your Island, Trinkets, Chatter are updated in real-time upon creation, modification, or deletion.
- The Chatter and Trinkets from your Friends are updated in real-time.
- Friendship requests are sent, updated, or removed in real-time

### Responsiveness
- The User Interface is clear and consistent across all sizes
- The design philosophies and the UX are carried onto every device

## Tech Stack

### Frontend
- React 19
- Vite
- TypeScript
- Redux Toolkit + RTK Query
- Custom CSS (no framework) - hand-built component system
- Custom iconography and visual identity

### Backend
- Node.js
- Express 5
- TypeScript
- bcrypt (password hashing)
- JWT (authentication)

### Services
- Supabase — managed PostgreSQL
- Cloudflare R2 — object storage (images, video, audio), accessed via AWS SDK (S3-compatible API)
 
### Deployment
- Render

## Roadmap

### Coming Soon
- Trinkets: UI for Playlist and Collection Trinket types; UI for editing and deleting Trinkets and/or their items
- Settings: UI for name/username/email/password changes (already supported by the API, no frontend yet) and account deletion
- Islands: UI for editing and deleting the Island
- Interactions: Stars (likes) and Replies on Chatter and Trinkets
- Collect: Save someone else's trinket to your own island for quick access
- Bubbles: Create groups of Friends and share your Chatter and Trinkets to them.
- Collection Types: Ready templates for quick Collection setup, e.g. reviews, logs, etc.

### Future Vision
- Dedicated Island customization view, separate from the current profile layout
- Widgets: Pin Trinkets to the right sidebar for easy access and music playback (for Playlists).
- Dashboard: A private view for the owner only, with tasks, notes, lists.
- Dark Mode (and potentially Colour Modes)
- Island and Trinket Themes: E.g. choosing a cassette-deck or CD-Walkman UI for a Playlist
- Now Playing: See what a friend is currently listening to
- Spotify/Apple Music link embedding, as a storage-free alternative to uploading audio
- Bring-your-own-storage (BYOS): Own all your data by connecting your own S3/R2 bucket
- Paid Tier: Custom CSS theming and expanded storage

## Copyright & Intellectual Property

© 2026 Jinad Abd Alkader. All rights reserved.

All code, graphics, design assets, and intellectual property contained within this repository are the exclusive property of the author. 

No part of this project may be copied, reproduced, distributed, modified, or used to create derivative works in any form or by any means without express prior written permission from the owner.
