/**
 * @version 1
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of conditions and
 *     the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from this
 *     software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

/*

A script to scan jsx and tsx files for translatable text and update translation json files.

*/

// imports

const path = require('path');
const {promises: fs} = require('fs');

// endregion

// region types

/**
 * The file locations are all relative to the location of the configuration file.
 *
 * @typedef {object} Configuration
 * @property {string[]} sourceFolders One or more source folders
 * @property {string} targetFile File to create or update with texts
 * @property {string} unusedFile File to create or update with texts with ids that are no longer found
 * @property {string[]} languages One or more language codes to create empty entries for
 * @property {string} [contentLanguage] When not empty add the content using this language (default = '')
 * @property {string[]} [tags] Tags to look for (default = ['UFTT', 'UFTTSpan', 'UFTTDiv', 'UFTTHtml'])
 * @property {boolean} [cleanLanguages] Remove translations for languages not present in languages (default = false)
 */

// endregion

// region constants

/**
 * Name of configuration file
 *
 * @type {string}
 */
const CONFIG_FILE = 'ufttconfig.json';

// endregion

// region variables

/**
 * Folder that contains the configuration file.
 *
 * @type {string}
 */
let m_configFolder;

/**
 * Configuration
 *
 * @type {Configuration}
 */
let m_configuration = {
  sourceFolders: ['src'],
  targetFile: 'src/translations/translation.json',
  unusedFile: 'src/translations/unused.json',
  languages: [],
  contentLanguage: '',
  tags: ['UFTT', 'UFTTSpan', 'UFTTDiv', 'UFTTHtml'],
  cleanLanguages: false
};

/**
 * All translations
 *
 * @type {object}
 */
let m_translations;

/**
 * All unused translations
 *
 * @type {object}
 */
let m_unusedTranslations;

/**
 * List of all sources files
 *
 * @type {string[]}
 */
let m_sourceFiles = [];

/**
 * Regular expression to find all data.
 *
 * @type {RegExp}
 */
let m_expression;

/**
 * Used ids.
 *
 * @type {string[]}
 */
let m_usedIds = [];

/**
 * Number of new entries.
 *
 * @type {number}
 */
let m_newCount = 0;

/**
 * Number of updated entries.
 *
 * @type {number}
 */
let m_updateCount = 0;

/**
 * Number of skipped entries.
 *
 * @type {number}
 */
let m_skipCount = 0;

/**
 * Number of languages added.
 *
 * @type {number}
 */
let m_addLanguageCount = 0;

/**
 * Number of languages removed.
 *
 * @type {number}
 */
let m_removeLanguageCount = 0;

// endregion

// region utility functions

/**
 * Checks if a file exists.
 *
 * @param {string} aPath
 *   Path and filename to check.
 *
 * @returns {Promise<boolean>}
 */
async function fileExists(aPath) {
  return !!(await fs.stat(aPath).catch(() => false));
}

/**
 * Loads and parses a json file. If there is an error, the function exits the process with an error. If the file
 * can not be found, return a default value.
 *
 * @param {string} aFileWithPath
 *   Path and filename to load.
 * @param {object} aDefault
 *   Default value to return
 *
 * @returns {Promise<object>} Parsed data or aDefault
 */
async function loadJsonFile(aFileWithPath, aDefault) {
  try {
    if (await fileExists(aFileWithPath)) {
      console.info(`Loading ${aFileWithPath}`);
      return JSON.parse(await fs.readFile(aFileWithPath, 'utf8'));
    }
    return aDefault;
  } catch (error) {
    exitWithError(`Error reading or parsing the JSON file ${aFileWithPath}`);
  }
}

/**
 * Saves a data to a JSON file. If there is an error, the function exits the process with an error.
 *
 * @param {string} aFileWithPath
 *   Path and filename to save to.
 * @param {object} aData
 *   Data to save.
 *
 * @returns {Promise<void>}
 */
async function saveJsonFile(aFileWithPath, aData) {
  try {
    console.info(`Saving ${aFileWithPath}`);
    await fs.writeFile(aFileWithPath, JSON.stringify(aData, null, 2));
  } catch (error) {
    exitWithError(`Error writing to ${aFileWithPath}`);
  }
}

/**
 * Reads a file as text. If there is an error, the function exits the process with an error.
 *
 * @param {string} aFileWithPath
 *   Path and filename to load.
 *
 * @returns {Promise<string>} content of file.
 */
async function loadTextFile(aFileWithPath) {
  try {
    return await fs.readFile(aFileWithPath, 'utf8');
  } catch (error) {
    exitWithError(`Error reading the file ${aFileWithPath}`);
  }
}

/**
 * Write error to console and exit the process.
 *
 * @param {string} anError
 *   Error message to write.
 */
function exitWithError(anError) {
  console.error(anError);
  process.exit(1);
}

/**
 * Gets all files including full path and processes all subfolders recursively.
 *
 * @param {string} aPath
 *   Path to start in
 * @param {string[]} aFileList
 *   Will be filled with files.
 *
 * @returns {Promise<void>}
 */
async function findFiles(aPath, aFileList) {
  const files = await fs.readdir(aPath);
  for (const file of files) {
    const fileWithPath = path.join(aPath, file);
    if ((await fs.stat(fileWithPath)).isDirectory()) {
      await findFiles(fileWithPath, aFileList);
    } else if (['.jsx', '.tsx'].includes(path.extname(file).toLowerCase())) {
      aFileList.push(fileWithPath);
    }
  }
}

/**
 * Sorts the translations on key values.
 *
 * @param {object} aTranslations
 *   Translations
 *
 * @returns {object} translations sorted on keys
 */
function sortTranslations(aTranslations) {
  const result = {};
  const keys = [...Object.keys(aTranslations)].sort();
  for (key of keys) {
    result[key] = aTranslations[key];
  }
  return result;
}

// endregion

// region configuration functions

/**
 * Loads the configuration file, exits if an error occurs.
 *
 * @param {string} aFileWithPath
 *   Path and filename to load.
 *
 * @returns {Promise<void>}
 */
async function loadConfiguration(aFileWithPath) {
  try {
    m_configuration = Object.assign(m_configuration, JSON.parse(await fs.readFile(aFileWithPath, 'utf8')));
  } catch (error) {
    exitWithError(`Error reading or parsing the configuration file ${aFileWithPath}`);
  }
}

/**
 * Tries to find a configuration file, by going through all parent folders. Exits if none can be found
 *
 * @returns {Promise<void>}
 */
async function findConfiguration() {
  for (let folder = __dirname; folder.length > 2; folder = path.dirname(folder)) {
    const fileWithPath = path.join(folder, CONFIG_FILE);
    if (await fileExists(fileWithPath)) {
      console.info(`Using configuration file: ${fileWithPath}`);
      m_configFolder = folder;
      await loadConfiguration(fileWithPath);
      return;
    }
  }
  exitWithError(`Can not find ${CONFIG_FILE} in this path or any of the parent paths of ${__dirname}`);
}

// endregion

// region language files

/**
 * Loads the existing translation files (if any)
 *
 * @returns {Promise<void>}
 */
async function loadTranslations() {
  m_translations = await loadJsonFile(path.join(m_configFolder, m_configuration.targetFile), {});
  m_unusedTranslations = await loadJsonFile(path.join(m_configFolder, m_configuration.unusedFile), {});
}

/**
 * Saves the translation files.
 *
 * @returns {Promise<void>}
 */
async function saveTranslations() {
  await saveJsonFile(path.join(m_configFolder, m_configuration.targetFile), sortTranslations(m_translations));
  await saveJsonFile(path.join(m_configFolder, m_configuration.unusedFile), sortTranslations(m_unusedTranslations));
}

// endregion

// region source parsing

/**
 * Gets all source files from the source folders configuration.
 *
 * @returns {Promise<void>}
 */
async function getAllSourceFiles() {
  for (const sourceFolder of m_configuration.sourceFolders) {
    await findFiles(path.join(m_configFolder, sourceFolder), m_sourceFiles);
  }
}

/**
 * Processes all sources files.
 *
 * @returns {Promise<void>}
 */
async function processSourceFiles() {
  let count = 0;
  for (const sourceFile of m_sourceFiles) {
    count++;
    await processSourceFile(sourceFile);
  }
  console.info(
    `Scanned ${count} source files, added ${m_newCount} entries, updated ${m_updateCount} contents,`
    + ` skipped ${m_skipCount} contents, added ${m_addLanguageCount} language entries`
    + (m_configuration.cleanLanguages ? `, removed ${m_removeLanguageCount} language entries` : '')
  );
}

/**
 * Processes a source file.
 *
 * @param {string} aFileWithPath
 * @returns {Promise<void>}
 */
async function processSourceFile(aFileWithPath) {
  const source = await loadTextFile(aFileWithPath);
  try {
    const matches = source.matchAll(m_expression);
    for (const match of matches) {
      const content = (match.groups.content.replace(/\r/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ')).trim();
      updateTranslation(match.groups.ttid, content);
    }
  } catch (error) {
    console.error(error);
    exitWithError(`Error occurred while processing ${aFileWithPath}`);
  }
}

/**
 * Builds the regular expression used to get the ttid and content.
 */
function buildExpression() {
  const tags = m_configuration.tags.join('|');
  // there is . across newlines; so use [\s\S] (see https://stackoverflow.com/a/13519983/968451)
  const reg = `<(${tags})((([\\s\\S]*?)(ttid="(?<ttid>.*)")([\\s\\S]*?))|([\\s\\S]*?))>(?<content>[\\s\\S]+?)<\\/\\1.*?>`;
  m_expression = new RegExp(reg, 'g');
}

/**
 * Updates an entry in the translation dictionary.
 *
 * @param {string|undefined} anId
 *   Id or undefined or empty to use aContent
 * @param {string} aContent
 *   Content
 */
function updateTranslation(anId, aContent) {
  // exit if there is no content and no id
  if (!aContent && (!anId || !anId.length)) {
    return;
  }
  const id = (!anId || !anId.length) ? aContent : anId;
  m_usedIds.push(id);
  revive(id);
  addTranslation(id, aContent);
}

/**
 * Checks if a translation is present in the unused part and move it back to the translation if no translation exists
 * for that id.
 *
 * The translation will get deleted from the unused part even it was not moved.
 *
 * @param {string} anId
 */
function revive(anId) {
  if (m_unusedTranslations.hasOwnProperty(anId)) {
    if (!m_translations.hasOwnProperty(anId)) {
      m_translations[anId] = m_unusedTranslations[anId];
    }
    delete m_unusedTranslations[anId];
  }
}

/**
 * Updates the counters for a translation.
 *
 * @param {string} anId
 *   Id of translation
 * @param {string} aContent
 *   New content.
 */
function updateCounters(anId, aContent) {
  if (m_translations.hasOwnProperty(anId)) {
    if (m_translations[anId]['_'] === aContent) {
      m_skipCount++;
    } else {
      m_updateCount++;
    }
  } else {
    m_newCount++;
  }
}

/**
 * Checks if the id is already added with different content. Shows a warning if it has.
 *
 * @param {object} aTranslation
 *   Translation to check
 * @param {string} anId
 *   Id to check
 * @param {string} aContent
 *   Content to check
 */
function checkContent(aTranslation, anId, aContent) {
  if (aTranslation.hasOwnProperty('_') && m_usedIds.includes(anId) && (aContent !== aTranslation['_'])) {
    console.warn(
      `[WARNING] adding entry for "${anId}" with different content: original="${aTranslation['_']}" new="${aContent}"`
    );
  }
}

/**
 * Adds a translation to translations.
 *
 * @param {string} anId
 * @param {string} aContent
 */
function addTranslation(anId, aContent) {
  updateCounters(anId, aContent);
  const translation = m_translations.hasOwnProperty(anId) ? m_translations[anId] : (m_translations[anId] = {});
  checkContent(translation, anId, aContent);
  translation['_'] = aContent;
  if (m_configuration.contentLanguage && !translation.hasOwnProperty(m_configuration.contentLanguage)) {
    translation[m_configuration.contentLanguage] = aContent;
  }
  updateLanguages(translation);
  if (m_configuration.cleanLanguages) {
    cleanLanguages(translation);
  }
}

/**
 * Updates a translation and adds missing languages.
 *
 * @param {object} aTranslation
 */
function updateLanguages(aTranslation) {
  m_configuration.languages.forEach(language => {
    if (!aTranslation.hasOwnProperty(language)) {
      m_addLanguageCount++;
      aTranslation[language] = '';
    }
  });
}

/**
 * Updates a translation and removes unused language  entries.
 *
 * @param {object} aTranslation
 */
function cleanLanguages(aTranslation) {
  for (const key of Object.keys(aTranslation)) {
    if ((key !== '_') && !m_configuration.languages.includes(key) && (key !== m_configuration.contentLanguage)) {
      m_removeLanguageCount++;
      delete aTranslation[key];
    }
  }
}

/**
 * Moves all translations with ids that are no longer used to the unused file.
 */
function moveUnusedTranslations() {
  let count = 0;
  for (const key of Object.keys(m_translations)) {
    if (!m_usedIds.includes(key)) {
      count++;
      m_unusedTranslations[key] = m_translations[key];
      delete m_translations[key];
    }
  }
  if (count) {
    console.info(`Moved ${count} entries to unused`);
  }
}

/**
 * Finds all the ids for a certain content.
 *
 * @param {string} aContent
 *   Content to find ids for
 *
 * @returns {string[]} found ids
 */
function findIdsForContent(aContent) {
  const result = [];
  for (const id of Object.keys(m_translations)) {
    if (m_translations[id]['_'] === aContent) {
      result.push(id);
    }
  }
  return result;
}

/**
 * Checks if multiple ids have the same content.
 */
function checkSameContent() {
  const processedIds = [];
  for (const id of Object.keys(m_translations)) {
    if (!processedIds.includes(id)) {
      const ids = findIdsForContent(m_translations[id]['_']);
      if (ids.length > 1) {
        console.warn(`[INFO] "${ids.join('", "')}" have the same content "${m_translations[id]['_']}"`);
      }
      processedIds.push(...ids);
    }
  }
}

// endregion

// region startup code

// use a wrapped function so async is possible.
(async function () {
  console.info('** UFTT scanner v1.0 **');
  await findConfiguration();
  await loadTranslations();
  await getAllSourceFiles();
  buildExpression();
  await processSourceFiles();
  moveUnusedTranslations();
  await saveTranslations();
  checkSameContent();
})();

// endregion