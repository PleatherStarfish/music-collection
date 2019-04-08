#!/usr/bin/env node

// Music Collection CLI

// Avalible Commands:
// =============================
// add,
// play,
// play ${album},
// show all,
// show all by ${artist},
// show played,
// show unplayed,
// show al played by ${artist}
// =============================

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

    returnMusic(input) {
        // Switch statement evaluates user input commands
        switch (input[0]) {

            case("quit"):
                console.log("Bye!");
                rl.close();
                break;

            case("add"):

                if (input.length !== 3 || !input[1] || !input[2]) {

                    console.log("Input must be in the form:\nadd \"Album\" \"Artist\"");
                    return getUserInput();
                }
                else {

                    const album = `"${input[1]}"`;
                    const artist = input[2];

                    // Check if an album is already in the collection
                    if (this.collection.has(album)) {
                        console.log("Album is already in the collection.");
                        return getUserInput();
                    } else {
                        this.add(album, artist);
                        return getUserInput();
                    }
                }
                break;

            case("show all"):

                this.showAll();
                return getUserInput();
                break;

            case("play"):

                this.play(`"${input[1]}"`);
                return getUserInput();
                break;

            case("show played"):

                this.getPlayed();
                return getUserInput();
                break;

            case("show unplayed"):

                this.getUnplayed();
                return getUserInput();
                break;

            case("show all by"):

                if (input.length !== 2 || !input[1]) {

                    console.log("Input must be in the form:\nshow all by \"Artist\"");
                    return getUserInput();
                    break;
                }
                else {

                    this.getAlbumsBy(input[1]);
                    return getUserInput();
                    break;
                }

            case("show played by"):
                if (input.length !== 2 || !input[1]) {

                    console.log("Input must be in the form:\nshow played by \"Artist\"");
                    return getUserInput();
                    break;
                }
                else {
                    this.getPlayedBy(input[1]);
                    return getUserInput();
                    break;
                }

            case("show unplayed by"):
                if (input.length !== 2 || !input[1]) {

                    console.log("Input must be in the form:\nshow unplayed by \"Artist\"");
                    return getUserInput();
                    break;
                }
                else {
                    this.getUnplayedBy(input[1]);
                    return getUserInput();
                    break;
                }

            default:
                console.log("Unknown command. Please try again.");
                return getUserInput();
                break;
        }
    }

    add(album, artist, played=false) {

        // Add album to main collection
        this.collection.set(album, { ["title"]: album, ["artist"]: artist, ["played"]: played });

        // Cache album as unplayed unless "played" property is true
        if (played) { this.playedTracks.set(album, {["title"]: album, ["artist"]: artist}); }
        else { this.unplayedTracks.set(album, {["title"]: album, ["artist"]: artist}); }

        // Cache data in new map by artist name
        if (this.collectionByArtist.has(artist)) {
            this.collectionByArtist.get(artist).push({ ["title"]: album, ["artist"]: artist, ["played"]: played });
        }
        else {
            this.collectionByArtist.set(artist, new Array({ ["title"]: album, ["artist"]: artist, ["played"]: played } ));
        }

        console.log(`Added ${album} by ${artist}`);
    }

    play(album) {
        if (this.collection.has(album)) {
            console.log(`You're listening to ${album}`); // Inform user album is playing
            this.collection.get(album).played = true;    // Set albums play status to 'played'

            const playedArtist =  this.collection.get(album).artist;
            this.playedTracks.set(album, { ["title"]: album, ["artist"]: playedArtist}); // cache played status

            this.collectionByArtist.get(playedArtist).forEach((i) => { // cache played status in artist collection
                if (i.title === album) {
                    i.played = true;
                }
            });

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

    getAlbumsBy(artist) {
        return this.collectionByArtist.get(artist).forEach((i) =>
            console.log(`${i.title} by ${i.artist}`)
        );
    }

    getPlayedBy(artist) {
        return this.collectionByArtist.get(artist).forEach((i) => {
            if (i.played) {
                console.log(`${i.title} by ${i.artist}`)
            }
        });
    }

    getUnplayedBy(artist) {
        return this.collectionByArtist.get(artist).forEach((i) => {
            if (!i.played) {
                console.log(`${i.title} by ${i.artist}`)
            }
        });
    }
}

const musicCollection = new MusicCollection();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Welcome to your music collection! \n");
const getUserInput = function() {
    rl.question("> ", function (answer) {

        if (!answer) {
            console.log("Null value input. Please try again.");
            return getUserInput();
        }

        const parseInput = /(?=\S)[\w\s]+(?<=\S)|[\w+]/g; // RegEx input on groups of words and words grouped by quotes
        const input = answer.match(parseInput);           // Split input into commands with RegEx
        musicCollection.returnMusic(input);               // pass user-entered input to switch in class

    });
};

getUserInput(); // Call function to start interacting with a new music collection.

// exports
module.exports = {
    MusicCollection: MusicCollection
};