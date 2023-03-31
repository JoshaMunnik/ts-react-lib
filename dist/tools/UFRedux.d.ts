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
import { ThunkAction } from "redux-thunk";
/**
 * Helper type to get the type signature of a thunk action function for use within Props. It combines
 * the original function parameters with the return type of the dispatch function.
 *
 * Based on comment of topic:
 * https://github.com/reduxjs/redux-thunk/issues/213
 */
export type UFThunkPropsType<T extends (...args: any[]) => ThunkAction<any, any, any, any>> = (...args: Parameters<T>) => ReturnType<ReturnType<T>>;
export declare class UFRedux {
    /**
     * Builds a reducer action. Assumes the action object contains a property named 'type'. Since it is not possible
     * to obtain the enum value type from an enum value or vice versa the method must be called two times with the same
     * enum value type.
     *
     * The payload properties can be set using the returned function. If there is no payload, use empty object (`{}`).
     *
     * Since partial type inference is not possible, two functions are needed.
     *
     * This method can be used to skip the definition of action objects, but only use action functions and the ReturnType
     * of typescript to get action object type.
     *
     * Example:
     * ````typescript
     * enum ReducerAction {
     *   //...
     *   ShowDialog: 'SHOW_DIALOG'
     * }
     * const show = UFRedux.reducerAction<ReducerAction.ShowDialog>(ReducerAction.ShowDialog)({ title: 'some title'});
     *
     * type reducerAction = ReturnType<typeof show>; // | ...
     * ````
     *
     * @param aType
     *   The enum value type the action is
     * @returns a function that expects a payload object with 'type' property which is added by the outer function.
     */
    static reducerAction<T>(aType: T): <P = {}>(aData: P) => {
        type: T;
    } & P;
}
