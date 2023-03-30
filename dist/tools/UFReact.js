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
import { isValidElement } from 'react';
// endregion
// region type
/**
 * {@link UFReact} implements static support method for React.
 */
export class UFReact {
    /**
     * Converts a node to a string.
     *
     * Code based on:
     * https://github.com/sunknudsen/react-node-to-string
     *
     * @param aNode
     *   React node to convert.
     *
     * @returns Convert node
     */
    static nodeToString(aNode) {
        if (typeof aNode === 'string') {
            return aNode;
        }
        if (typeof aNode === 'number') {
            return aNode.toString();
        }
        if (Array.isArray(aNode)) {
            return aNode.reduce((previous, child) => previous + UFReact.nodeToString(child), '');
        }
        if (isValidElement(aNode)) {
            return `<${aNode.type}>${UFReact.nodeToString(aNode.props.children)}</${aNode.type}>`;
        }
        return '';
    }
}
// endregion
//# sourceMappingURL=UFReact.js.map