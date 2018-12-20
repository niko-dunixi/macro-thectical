// ==UserScript==
// @name         macro-thetical
// @namespace    http://paulbaker.io
// @version      0.5.6
// @description  Reads my macros, prints out how many I have left, and some hypothetical foods I can still eat with my allowance :)
// @author       Paul Nelson Baker
// @match        https://www.fitbit.com/foods/log
// @match        https://www.fitbit.com/foods/log/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL  https://github.com/paul-nelson-baker/macro-thectical/raw/master/macro-thetical.user.js
// @updateURL    https://github.com/paul-nelson-baker/macro-thectical/raw/master/macro-thetical.user.js
// ==/UserScript==

/*
My macros are based on my body height/type/shape and my
fitness goals. Get yours from your personal trainer :)
*/
const maxValues = {
    fat: 133,
    carbs: 20,
    protein: 110,
}

console.log('Using max macros', maxValues);

function parseMacroValue(macroJQuerySelector) {
    let currentMacroElement = $(macroJQuerySelector);
    let currentMacroText = currentMacroElement.text();
    let currentMacroValue = parseFloat(currentMacroText.replace(/\s+g/gi, ''))
    return currentMacroValue;
}

function getRemainingMacros(maxValues) {
    let fatSelector = '#dailyTotals > div > div:nth-child(3) > div > div.amount';
    let carbsSelector = '#dailyTotals > div.content.firstBlock > div:nth-child(5) > div > div.amount';
    let fiberSelector = '#dailyTotals > div.content.firstBlock > div:nth-child(4) > div > div.amount';
    let proteinSelector = '#dailyTotals > div.content.firstBlock > div:nth-child(7) > div > div.amount';
    return {
        'fat': maxValues.fat - parseMacroValue(fatSelector),
        'carbs': maxValues.carbs - parseMacroValue(carbsSelector) + parseMacroValue(fiberSelector),
        'protein': maxValues.protein - parseMacroValue(proteinSelector),
    };
}

function createRowContainer() {
    // Create all the rows
    let customRowsSelector = 'div#my-custom-rows';
    if ($(customRowsSelector).length === 0 || $(customRowsSelector).is(":hidden")) {
        $('div#dailyTotals').append('<div id="my-custom-rows"></div>');
        console.log('Creating row container', $(customRowsSelector)[0]);
    }
}

function createRow(rowElementId, rowText) {
    createRowContainer();

    let customRowsElement = $('div#my-custom-rows');
    let selector = 'div#' + rowElementId;
    if ($(selector).length === 0) {
        customRowsElement.append('<div id=' + rowElementId + ' class="content"></div>');
        let resultElement = $(selector);
        resultElement.text(rowText);
        console.log('Creating row inside container', resultElement[0]);
    }
}

function initializeCustomRows() {
    // Gather Remainders
    let remainingMacros = getRemainingMacros(maxValues);
    // Maxes (to remind me), Remainders, Remainders in terms of EGGS <3!!!
    createRow('my-max', 'Max Fat/Net-Carb/Protein: ' + maxValues.fat + ' / ' + maxValues.carbs + ' / ' + maxValues.protein);
    createRow('my-remainders', 'Remaining Fat/Net-Carb/Protein: ' + remainingMacros.fat + ' / ' + remainingMacros.carbs + ' / ' + remainingMacros.protein);
    createRow('my-eggs', 'How many more eggs can I eat today? ' + Math.floor(Math.min(remainingMacros.fat / 5, remainingMacros.protein / 6)) + ' 🥚')
}

(function() {
    'use strict';
    setInterval(initializeCustomRows, 100);
    // initializeCustomRows();
})();
