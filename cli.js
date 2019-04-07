#!/usr/bin/env node

const inquirer = require("inquirer");
const readline = require('readline');

const musicCollection = {};        // Object to store music collection
const parseInput = /\w+|"[^"]*"/g; // Split input on words and quotes

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getUserInput = function() {
    rl.question("Welcome to your music collection! \n", function(answer) {

        const input = answer.match(parseInput);

        if (answer === "quit") {
            console.log("Bye!");
            rl.close();
        }
        else if (input[0] === "add") {

            const album = input[1];
            const artist = input[2].slice(1, -1); // Store artist without quotes.

            musicCollection[album] = artist; // Add album and artist as key/value to object

            console.log(`Added ${album} by ${artist}`);

        } else {
            getUserInput();
        }
    });
};

getUserInput();