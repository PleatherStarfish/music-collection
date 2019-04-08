const cli = require('./cli.js');
let MusicCollection = cli.MusicCollection;

function setupTest(text) {
    const musicCollection = new MusicCollection();
    parseInput = /(?=\S)[\w\s]+(?<=\S)|[\w+]/g; // RegEx input on groups of words and words grouped by quotes
    console.log = jest.fn();
    const input =  text.match(parseInput);
    musicCollection.returnMusic(input);
    return musicCollection;
}

// Some simple tests written in Jest.

it('TEST 1 - Empty album and artist should log error.', () => {
    setupTest(`add "" ""`);
    expect(console.log).toHaveBeenCalledWith("Input must be in the form:\nadd \"Album\" \"Artist\"");
});

it('TEST 2 - Short array should log error.', () => {
    setupTest(`add "album"`);
    expect(console.log).toHaveBeenCalledWith("Input must be in the form:\nadd \"Album\" \"Artist\"");
});

it('TEST 3 - "add" only command should log error.', () => {
    setupTest(`add`);
    expect(console.log).toHaveBeenCalledWith("Input must be in the form:\nadd \"Album\" \"Artist\"");
});

it('TEST 4 - Nonsense should log \"Unknown command.\"', () => {
    setupTest(`000`);
    expect(console.log).toHaveBeenCalledWith("Unknown command. Please try again.");
});

it('TEST 5 - Should return name and artist of track.', () => {
    const musicCollection = setupTest(`add "Ride the Lightning" "Metallica"`);
    expect(console.log).toHaveBeenCalledWith(`Added "Ride the Lightning" by Metallica`);
});