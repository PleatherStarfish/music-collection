#!/usr/bin/env node

const inquirer = require("inquirer");
const readline = require('readline');

class MusicCollection {            // Class to store music collection and methods for collection
    constructor() {
        this.collection = new Map();
    }

    add(album, artist, played=false) {

        this.collection.set(album, {["title"]: album, ["artist"]: artist, ["played"]: played });
        console.log(`Added ${album} by ${artist}`);
        console.log(this.collection);
    }

    play(album) {

    }

    get showAll() {

    }

    get getPlayed() {

    }

    get getUnplayed() {

    }
};

const musicCollection = new MusicCollection();

const parseInput = /\w+|"[^"]*"/g; // Split input on words and quotes

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Welcome to your music collection! \n")
const getUserInput = function() {
    rl.question("> ", function(answer) {

        const input = answer.match(parseInput); // Split input into a list of statement

        switch(input[0]) {

            case("quit"):
                console.log("Bye!");
                rl.close();

            case("add"):

                if (input.length !== 3) {

                    console.log("Input must be in the form:\nadd \"album\" \"artist\"");
                    getUserInput();
                }
                else {

                    const album = input[1];
                    const artist = input[2].slice(1, -1); // Store artist without quotes.

                    // Check if an album is already in the collection
                    if (musicCollection.collection.has(album)) {
                        console.log("Album is already in the collection.");
                        getUserInput();
                    } else {
                        musicCollection.add(album, artist);
                        getUserInput();
                    }
                }

            case("show all"):

            default:
                console.log("Unknown command. Please try again.")
                getUserInput();
        }
    });

getUserInput();