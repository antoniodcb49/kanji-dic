import {kanjiDic} from './KanjiDic.js';

export function getDefinitions (japWord) {
    let kanjiDicArray = kanjiDic.split('\n'); 
    let definitions = [];
    
    for (let entry in kanjiDicArray) {
        let entryArray = kanjiDicArray[entry].split('_');

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