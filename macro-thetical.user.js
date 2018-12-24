// ==UserScript==
// @name         macro-thetical
// @namespace    http://paulbaker.io
// @version      0.5.9
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
fitness goals. Get yours from your personal trainer or online calculator :)

Here is a popular calculator: https://ketogains.com/ketogains-calculator/
*/
(function (jqueryInstance) {
'use strict';

    let MacroTastic = (function(jqueryInstance) {

        function MacroTastic(maxValues) {
            let self = this;
            self.maxValues = {};
            self.maxValues.fat  = (maxValues.fat) ? maxValues.fat : 0;
            self.maxValues.carbs = (maxValues.carbs) ? maxValues.carbs : 0;
            self.maxValues.protein = (maxValues.protein) ? maxValues.protein : 0;
            self.maxValues.weeklyCalories = (maxValues.weeklyCalories) ? maxValues.weeklyCalories : 0;
            self.maxValues.dailyCalories  = (maxValues.dailyCalories) ? maxValues.dailyCalories : 0;

            self.$ = jqueryInstance;
            console.log('Using max macros', self.maxValues);
            self.$("body").on('DOMSubtreeModified', "#foodlog", () => {
                self.initializeCustomRows();
            });
            self.initializeCustomRows();

        }

        MacroTastic.prototype.parseMacroValue = function(macroJQuerySelector) {
            let self = this;
            let currentMacroElement = self.$(macroJQuerySelector);
            let currentMacroText = currentMacroElement.text();
            let currentMacroValue = parseFloat(currentMacroText.replace(/\s+g/gi, ''))
            return currentMacroValue;
        };

        MacroTastic.prototype.getRemainingMacros = function(maxValues) {
            let self = this;
            let fatSelector = '#dailyTotals > div > div:nth-child(3) > div > div.amount';
            let carbsSelector = '#dailyTotals > div.content.firstBlock > div:nth-child(5) > div > div.amount';
            let fiberSelector = '#dailyTotals > div.content.firstBlock > div:nth-child(4) > div > div.amount';
            let proteinSelector = '#dailyTotals > div.content.firstBlock > div:nth-child(7) > div > div.amount';
            return {
                'fat': self.maxValues.fat - self.parseMacroValue(fatSelector),
                'carbs': self.maxValues.carbs - self.parseMacroValue(carbsSelector) + self.parseMacroValue(fiberSelector),
                'protein': self.maxValues.protein - self.parseMacroValue(proteinSelector),
            };
        };

        MacroTastic.prototype.createRowContainer = function() {
            // Create all the rows
            let self = this;
            let customRowsSelector = 'div#my-custom-rows';
            if (self.$(customRowsSelector).length === 0 || self.$(customRowsSelector).is(":hidden")) {
                self.$('div#dailyTotals').append('<div id="my-custom-rows"></div>');
                console.log('Creating row container', self.$(customRowsSelector)[0]);
            }
        };

        MacroTastic.prototype.createRow = function(rowElementId, rowInitializerCallback) {
            let self = this;
            self.createRowContainer();

            let customRowsElement = self.$('div#my-custom-rows');
            let selector = 'div#' + rowElementId;
            if (self.$(selector).length === 0) {
                customRowsElement.append('<div id=' + rowElementId + ' class="content"></div>');
                let resultElement = self.$(selector);
                rowInitializerCallback(resultElement);
                console.log('Creating row inside container', resultElement[0]);
            }
        };

        MacroTastic.prototype.createColumn = function(substanceLabel, substanceAmount, substanceUnit=undefined) {
            let htmlValue = `
                <div class="total">
                  <div class="label">
                    <div class="substance">${substanceLabel}</div>
                    <div class="amount">
                      ${substanceAmount} ${substanceUnit === undefined ? '' : `<span class="unit"> ${substanceUnit}</span>`}
                    </div>
                   </div>
                </div>
                `;
            return self.$(htmlValue);
        };

        MacroTastic.prototype.initializeCustomRows = function() {
            // Maxes (to remind me), Remainders, Remainders in terms of EGGS <3!!!
            let self = this;
            self.createRow('my-max', rowElement => {
                rowElement.append(self.$('<h3>Max Macros</h3>'));
                rowElement.append(self.createColumn('Fat', self.maxValues.fat, 'g'));
                rowElement.append(self.createColumn('Net Carbs', self.maxValues.carbs, 'g'));
                rowElement.append(self.createColumn('Protein', self.maxValues.protein, 'g'));
            });

            self.createRow('my-remainders', rowElement => {
                const remainingMacros = self.getRemainingMacros(self.maxValues);
                rowElement.append(self.$('<h3>Remaining Macros</h3>'));
                rowElement.append(self.createColumn('Fat', remainingMacros.fat, 'g'));
                rowElement.append(self.createColumn('Net Carbs', remainingMacros.carbs, 'g'));
                rowElement.append(self.createColumn('Protein', remainingMacros.protein, 'g'));
            });
            self.createRow('my-eggs', rowElement => {
                const remainingMacros = self.getRemainingMacros(self.maxValues);
                const remainingEggCount = Math.max(0, Math.floor(Math.min(remainingMacros.fat / 5, remainingMacros.protein / 6)));
                rowElement.append(self.$('<h3>Remaining Foods!</h3>'));
                rowElement.append(self.createColumn('Whole Eggs', remainingEggCount, '🥚'))
            });
        };

        return MacroTastic;
    })(jqueryInstance);

    // lets make this script an object so we can encapsulate everything and pass the maxValues object as a param when we initiate
    new MacroTastic({
        fat: 133,
        carbs: 20,
        protein: 110,
        weeklyCalories: 12005,
        dailyCalories: 1715,
    });
})(jQuery);