import { jsx as _jsx } from "react/jsx-runtime";
import { UFTranslationContext } from "../../contexts/UFTranslationContext.js";
/**
 * {@link UFTT} is a translatable text component.
 */
export const UFTT = ({ children, ttid, html = false, map }) => {
    return (_jsx(UFTranslationContext.Consumer, { children: (({ translate }) => translate(ttid, children, html, map)) }));
};
//# sourceMappingURL=UFTT.js.map