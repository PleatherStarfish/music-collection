#!/usr/bin/env node

const inquirer = require("inquirer");
const readline = require('readline');

// MusicCollection class instances represent music collections and methods on those collections
//
//   Note: This collection uses the album title as a unique key. This choice was made in order to fully exploit the
//         unique key feature of the Map, which ensures that album titles will always be unique (per instructions).
//         However, for some use cases it would be better to use a unique alphanumeric key generated from, for
//         example, the date and time when the album was added. This would allow multiple albums with the same name
//         to be saved as separate entries.
//
class MusicCollection {

    constructor() {
        // Map because we must be able to return entries in FIFO order
        this.collection         = new Map();

        // We cache "played" and "unplayed" for a more performant retrieval
        this.playedTracks       = new Map();
        this.unplayedTracks     = new Map();
        this.collectionByArtist = new Map();
    }

    add(album, artist, played=false) {

        // Add album to main collection
        this.collection.set(album, { ["title"]: album, ["artist"]: artist, ["played"]: played });

        // Cache album as unplayed unless "played" property is true
        if (played) {
            this.playedTracks.set(album, {["title"]: album, ["artist"]: artist});
        }
        else {
            this.unplayedTracks.set(album, {["title"]: album, ["artist"]: artist});
        }

        // Cache data in new table by artist name
        if (this.collectionByArtist.has(artist)) {
            this.collectionByArtist.get(artist).push({ ["title"]: album, ["artist"]: artist, ["played"]: played });
        }
        else {
            this.collectionByArtist.set(artist, new Array({ ["title"]: album, ["artist"]: artist, ["played"]: played }));
        }

        console.log(`Added ${album} by ${artist}`);
        console.log(this.collectionByArtist);
    }

    play(album) {
        if (this.collection.has(album)) {
            console.log(`You're listening to ${album}`); // Inform user album is playing
            this.collection.get(album).played = true;    // Set albums play status to 'played'

            const playedArtist =  this.collection.get(album).artist;
            this.playedTracks.set(album, { ["title"]: album, ["artist"]: playedArtist}); // cache played status

            this.unplayedTracks.delete(album);
        }
        else {
            console.log(`${album} is not yet in your collection.`)
        }
    }

    showAll() {
        return this.collection.forEach((value, key) =>
            console.log(`${key} by ${value.artist} (${value.played ? "played" : "unplayed"})`)
        );
    };

    getPlayed() {
        return this.playedTracks.forEach((value, key) =>
            console.log(`${key} by ${value.artist}`)
        );
    }

    getUnplayed() {
        return this.unplayedTracks.forEach((value, key) =>
            console.log(`${key} by ${value.artist}`)
        );
    }
};

const musicCollection = new MusicCollection();

const parseInput = /[A-Za-z]+(\s[A-Za-z]+)?|"[^"]*"/g; // RegEx input on groups of words and words grouped by quotes

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Welcome to your music collection! \n")
const getUserInput = function() {
    rl.question("> ", function (answer) {

        const input = answer.match(parseInput); // Split input into commands with RegEx

        // Switch statement evaluates user input commands
        switch (input[0]) {

            case("quit"):
                console.log("Bye!");
                rl.close();
                break;

            case("add"):

                const album = input[1];
                const artist = input[2].slice(1, -1); // Store artist without quotes.

                if (input.length !== 3) {

                    console.log("Input must be in the form:\nadd \"album\" \"artist\"");
                    getUserInput();
                } else {

                    // Check if an album is already in the collection
                    if (musicCollection.collection.has(album)) {
                        console.log("Album is already in the collection.");
                        getUserInput();
                    } else {
                        musicCollection.add(album, artist);
                        getUserInput();
                    }
                }
                break;

            case("show all"):

                musicCollection.showAll();
                getUserInput();
                break;

            case("play"):

                musicCollection.play(input[1]);
                getUserInput();
                break;

            case("show played"):

                musicCollection.getPlayed();
                getUserInput();
                break;

            case("show unplayed"):

                musicCollection.getUnplayed();
                getUserInput();
                break;

            default:
                console.log("Unknown command. Please try again.");
                getUserInput();
                break;
        }
    });
};

getUserInput(); // Call function to start interacting with a new music collection.