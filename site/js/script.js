import { ajaxUtils } from './ajax-utils.js';

let dictionaryFileName = 'kanji-dictionary.txt';
let kanjiDicArray = [];

document.addEventListener("DOMContentLoaded", function(event) {
    getDictionary(dictionaryFileName);  
});


function getDictionary (dictionaryFileName) {
    ajaxUtils.sendGetRequest('./dictionary/' + dictionaryFileName, 
        function(allDefinitions) {
            kanjiDicArray = allDefinitions.split('\n');
        }, false);
}

export function getDefinitions (japaneseWord) {
    let definitions = [];
    japaneseWord = japaneseWord.trim();

    for (let entry of kanjiDicArray) {
        let entryArray = entry.split('_');

        for (let char in japaneseWord) {
            if (japaneseWord.at(char) == entryArray[1]) {
                definitions.push(entryArray);
            }
        }

        definitions.sort((a, b) => {
            let aIndex = japaneseWord.indexOf(a[1]);
            let bIndex = japaneseWord.indexOf(b[1]);
            return aIndex - bIndex;
        })
    }
    return definitions;
}

let defEntries = ["Kodansha Entry: ", "Kanji: ", "Jisho.org: ", 
"Kodansha: ", "JLPT: ", "Grade: "];

export function printDefinitions (japaneseWord) {
    //Array of valid definitions
    let definitions = getDefinitions(japaneseWord);
    let search_results = document.getElementById('search_results');

    if (definitions != null) {
        for (let def in definitions) {
            for (let index in definitions[def]) {
                search_results.innerHTML += 
                    defEntries[index] + definitions[def][index] + '<br>';
            }
            search_results.innerHTML += '<br>';
        }
        let linkToJisho = document.createElement('a');
        linkToJisho.setAttribute('id', 'jisho-link');
        linkToJisho.setAttribute('href', 'https://jisho.org/search/' + japaneseWord);
        linkToJisho.setAttribute('target', '_blank');
        linkToJisho.innerText = 'Link to Jisho';
        search_results.appendChild(linkToJisho);
        search_results.innerHTML += '<br>';
    }
    else
        search_results.innerHTML = "NOT FOUND";
}

document.getElementById('search').addEventListener('keypress', function(event) {
    let keyPressed = event.code;
    if (keyPressed.includes('Enter')) {
        printDefinitions(document.getElementById('search').value);
    }
})

document.getElementById('search-btn').addEventListener('click', function() {
    printDefinitions(document.getElementById('search').value);
})

document.getElementById('clear-btn').addEventListener('click', function() {
    document.getElementById("search_results").innerHTML = "";
})