// ==UserScript==
// @name         macro-thetical
// @namespace    http://paulbaker.io
// @version      0.2
// @description  Reads my macros, prints out how many I have left, and some hypothetical foods I can still eat with my allowance :)
// @author       Paul Nelson Baker
// @match        https://www.fitbit.com/foods/log
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL  https://github.com/paul-nelson-baker/macro-thectical/raw/master/macro-thetical.user.js
// @updateURL    https://github.com/paul-nelson-baker/macro-thectical/raw/master/macro-thetical.user.js
// ==/UserScript==

/*
My macros are based on my body height/type/shape and my
fitness goals. Get yours from your personal trainer :)
*/
const maxFat = 133;
const maxCarb = 20;
const maxProtein = 110;

function getRemainingMacros() {
    function parseGrams(element) {
        return parseFloat(element.text().replace(/\s+g/gi, ''));
    }
    function getRemainingFat() {
        let fatElement = $('#dailyTotals > div > div:nth-child(3) > div > div.amount');
        return maxFat - parseGrams(fatElement);
    }
    function getRemainingCarbs() {
        let carbElement = $('#dailyTotals > div.content.firstBlock > div:nth-child(5) > div > div.amount');
        return maxCarb - parseGrams(carbElement);
    }
    function getRemainingProtein() {
        let proteinElement = $('#dailyTotals > div.content.firstBlock > div:nth-child(7) > div > div.amount');
        return maxProtein - parseGrams(proteinElement);
    }
    return {
        'fat': getRemainingFat(),
        'carbs': getRemainingCarbs(),
        'protein': getRemainingProtein()
    };
}

function getInnerElement(elementId) {
    let customRowsElement = $('div#my-custom-rows');
    let selector = 'div#' + elementId;
    if ($(selector).length === 0) {
        customRowsElement.append('<div id=' + elementId + ' class="content"></div>');
    }
    let resultElement = $(selector);
    return resultElement;
}

function initializeCustomRows() {
    // Create all the rows
    let customRowsSelector = 'div#my-custom-rows';
    if ($(customRowsSelector).length === 0 || $(customRowsSelector).is(":hidden")) {
        $('div#dailyTotals').append('<div id="my-custom-rows"></div>');
    } else {
        return;
    }
    // Gather Remainders
    let remainingMacros = getRemainingMacros();
    // Maxes
    let myMaxes = getInnerElement('my-max');
    myMaxes.text('Max Fat/Carb/Protein: ' + maxFat + ' / ' + maxCarb + ' / ' + maxProtein);
    // Remainders
    let myRemainders = getInnerElement('my-remainders');
    myRemainders.text('Remaining Fat/Carb/Protein: ' + remainingMacros.fat + ' / ' + remainingMacros.carbs + ' / ' + remainingMacros.protein);
    // EGGS!!!
    let myEggs = getInnerElement('my-eggs');
    myEggs.text('How many more eggs can I eat today? ' + Math.floor(Math.min(remainingMacros.fat / 5, remainingMacros.protein / 6)) + ' 🥚');
    // Recreate everything when the page is updated
    //$(customRowsSelector).on('remove', function() {
    //    initializeCustomRows();
    //});
//    $('#foodlog > span').bind('destroyed', function() {
//        $(customRowsSelector).remove();
//        initializeCustomRows();
//    });
}



(function() {
    'use strict';
    setInterval(initializeCustomRows, 100);
    //initializeCustomRows();
})();
