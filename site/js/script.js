import { ajaxUtils } from './ajax-utils.js';

let kanjiDicArray = "";
function getDictionary (dictionaryFileName) {
    ajaxUtils.sendGetRequest('./dictionary/' + dictionaryFileName, 
        function(allDefinitions) {
            kanjiDicArray = allDefinitions.split('\n');
        }, false);
}

export function getDefinitions (japWord) {
    getDictionary('kanji-dictionary.txt');
    let definitions = [];
    
    for (let entry of kanjiDicArray) {
        let entryArray = entry.split('_');

        for (let char in japWord) {
            if (japWord.at(char) == entryArray[1]) {
                definitions.push(entryArray);
            }
        }

        definitions.sort((a, b) => {
            let aIndex = japWord.indexOf(a[1]);
            let bIndex = japWord.indexOf(b[1]);
            return aIndex - bIndex;
        })
    }
    return definitions;
}

let defEntries = ["Kodansha Entry: ", "Kanji: ", "Jisho.org: ", 
"Kodansha: ", "JLPT: ", "Grade: "];

export function printDefinitions (japWord) {
    //Array of valid definitions
    let definitions = getDefinitions(japWord);

    if (definitions != null) {
        for (let def in definitions) {
            for (let index in definitions[def]) {
                document.getElementById('search_results').innerHTML += 
                    defEntries[index] + definitions[def][index] + '<br>';
            }
            document.getElementById('search_results').innerHTML += '<br>';
        }
    }
    else
        document.getElementById('search_results').innerHTML = "NOT FOUND";
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