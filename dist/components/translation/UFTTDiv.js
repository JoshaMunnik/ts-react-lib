var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { UFTT } from "./UFTT.js";
// endregion
// region component
export const UFTTDiv = (_a) => {
    var { ttid, html, children } = _a, other = __rest(_a, ["ttid", "html", "children"]);
    return (_jsx("div", Object.assign({}, other, { children: _jsx(UFTT, Object.assign({ ttid: ttid, html: html }, { children: children })) })));
};
//# sourceMappingURL=UFTTDiv.js.map