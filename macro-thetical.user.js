// ==UserScript==
// @name         macro-thetical
// @namespace    http://paulbaker.io
// @version      0.1
// @description  Reads my macros, prints out how many I have left, and some hypothetical foods I can still eat with my allowance :)
// @author       Paul Nelson Baker
// @match        https://www.fitbit.com/foods/log
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

/*
My macros are based on my body height/type/shape and my
fitness goals. Get yours from your personal trainer :)
*/
const maxFat = 133;
const maxCarb = 20;
const maxProtein = 110;

function parseGrams(element) {
    return parseFloat(element.text().replace(/\s+g/gi, ''));
}

function getRemainingFat() {
    let fatElement = $('#dailyTotals > div > div:nth-child(3) > div > div.amount');
    return maxFat - parseGrams(fatElement);
}

function getRemainingCarb() {
    let carbElement = $('#dailyTotals > div.content.firstBlock > div:nth-child(5) > div > div.amount');
    return maxCarb - parseGrams(carbElement);
}

function getRemainingProtein() {
    let proteinElement = $('#dailyTotals > div.content.firstBlock > div:nth-child(7) > div > div.amount');
    return maxProtein - parseGrams(proteinElement);
}

function getInnerElement(elementId) {
    let dailyTotals = $('#dailyTotals');
    let selector = 'div#' + elementId;
    if ($(selector).length === 0) {
        dailyTotals.append('<div id=' + elementId + ' class="content"></div>');
    }
    let resultElement = $(selector);
    return resultElement;
}

(function() {
    'use strict';
    setInterval(function(){
        // Gather Remainders
        let remainingFat = getRemainingFat();
        let remainingCarb = getRemainingCarb();
        let remainingProtein = getRemainingProtein();
        // Maxes
        let myMaxes = getInnerElement('my-max');
        myMaxes.text('Max Fat/Carb/Protein: ' + maxFat + ' / ' + maxCarb + ' / ' + maxProtein);
        // Remainders
        let myRemainders = getInnerElement('my-remainders');
        myRemainders.text('Remaining Fat/Carb/Protein: ' + remainingFat + ' / ' + remainingCarb + ' / ' + remainingProtein);
        // EGGS!!!
        let myEggs = getInnerElement('my-eggs');
        myEggs.text('How many more eggs can I eat today? ' + Math.floor(Math.min(remainingFat / 5, remainingProtein / 6)) + ' 🥚');
    }, 100);
})();
