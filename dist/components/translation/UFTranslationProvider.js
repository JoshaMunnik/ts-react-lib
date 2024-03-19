import { jsx as _jsx } from "react/jsx-runtime";
import { UFTranslationContext } from "../../contexts/UFTranslationContext.js";
import { UFText } from "@ultraforce/ts-general-lib/dist/tools/UFText.js";
import { UFReact } from "../../tools/UFReact.js";
// endregion
// region local types and functions
/**
 * Returns a translated text (if any).
 *
 * @param anId
 *   Id to search for
 * @param aNode
 *   Default content to return if no entry for id could be found
 * @param aLanguage
 *   Language to get text for
 * @param aTexts
 *   Texts
 * @param anHtml
 *   When true parse the result through the html parser.
 * @param anHtmlParser
 *   Html parser that converts a html string to a React node.
 * @param aMap
 *   When set, replace keys with their values
 *
 * @returns Node containing the translated text
 */
function getText(anId, aNode, aLanguage, aTexts, anHtml, anHtmlParser, aMap) {
    if (anId == undefined) {
        anId = UFReact.nodeToString(aNode);
    }
    if (aTexts.hasOwnProperty(anId)) {
        const translations = aTexts[anId];
        if (translations.hasOwnProperty(aLanguage)) {
            let translation = translations[aLanguage];
            if (translation.length) {
                if (aMap) {
                    translation = UFText.replace(translation, aMap);
                }
                return anHtml ? anHtmlParser(translation) : translation;
            }
        }
    }
    if (aMap) {
        const text = UFText.replace(UFReact.nodeToString(aNode), aMap);
        return anHtml ? anHtmlParser(text) : text;
    }
    return aNode;
}
/**
 * {@link UFTranslationProvider} sets up the {@link UFTranslationContext} and handles changes to the language.
 */
export const UFTranslationProvider = ({ children, language, texts, htmlParser = (value) => value }) => {
    return (_jsx(UFTranslationContext.Provider, Object.assign({ value: {
            translate: (id, node, html, map) => getText(id, node, language, texts, html, htmlParser, map)
        } }, { children: children })));
};
//# sourceMappingURL=UFTranslationProvider.js.map