import { kanjiDic } from './KanjiDic.js';
import { ajaxUtils } from './ajax-utils.js';

let kanjiDictionary = kanjiDic.split('\n');

export function getDefinitions (japaneseWord) {
    let definitions = [];
    japaneseWord = japaneseWord.trim();

    for (let entry of kanjiDictionary) {
        //It will ignore any duplicated kanji
        for (let char of japaneseWord) {
            if(entry.includes(char) && definitions.indexOf(entry) == -1) {
                definitions.push(entry);
            }
        }

        definitions.sort((a, b) => {
            let aIndex = japaneseWord.indexOf(a.split('_')[1]);
            let bIndex = japaneseWord.indexOf(b.split('_')[1]);
            return aIndex - bIndex;
        })
    }
    return definitions;
}

let defEntries = ["Kodansha Entry: ", "Kanji: ", "Jisho.org: ", 
"Kodansha: ", "JLPT: ", "Grade: "];

export function printDefinitions (japaneseWord) {
    //Array of valid definitions
    //definitions = array, entries separated by '_'
    let definitions = getDefinitions(japaneseWord);
    let search_results = document.getElementById('search_results');

    if (definitions != null) {
        if (search_results.innerHTML != "")
            search_results.innerHTML += '<br>';

        for (let definition of definitions) {
            let currentDefinition = definition.split('_');
            for (let i = 0; i < defEntries.length; i++) {
                search_results.innerHTML += defEntries[i] + currentDefinition[i] + '<br>';
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
    if (event.key == 'Enter') {
        printDefinitions(document.getElementById('search').value);
    }
})

document.getElementById('search-btn').addEventListener('click', function() {
    printDefinitions(document.getElementById('search').value);
})

document.getElementById('clear-btn').addEventListener('click', function() {
    document.getElementById("search_results").innerHTML = "";
    let jmkanji = document.getElementById("jmkanji");
    ajaxUtils.sendGetRequest('./dictionary/kanji_bank_1.json', function(response) {
        let kanji_bank_1 = JSON.stringify(response, null, 4);
        jmkanji.innerHTML = kanji_bank_1;
    }, true);
})