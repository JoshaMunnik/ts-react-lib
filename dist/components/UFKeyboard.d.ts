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
import * as React from 'react';
/**
 * Callback type
 */
export type UFKeyboardCallback = (key: string, shift: boolean, ctrl: boolean, alt: boolean) => any;
/**
 * Properties for {@link UFKeyboard}.
 */
export interface UFKeyboardProps {
    /**
     * This can be used to call the callbacks only for certain keys.
     */
    readonly keys?: string | string[];
    /**
     * This callback is called when a key is down.
     */
    readonly onDown?: UFKeyboardCallback;
    /**
     * This callback is called when a key is up.
     */
    readonly onUp?: UFKeyboardCallback;
}
/**
 * {@link UFKeyboard} is an empty component that can be used to listen for certain key presses.
 */
export declare class UFKeyboard extends React.Component<UFKeyboardProps> {
    static readonly ESCAPE = "Escape";
    /**
     * Calls a callback if there is any and the key matches keys (if there are any).
     *
     * @param anEvent
     *   Event to process
     * @param aCallback
     *   Callback to call
     */
    private callCallback;
    /**
     * Handles key down events.
     */
    private handleKeyDown;
    /**
     * Handles key up events.
     */
    private handleKeyUp;
    /**
     * @inheritDoc
     */
    componentDidMount(): void;
    /**
     * @inheritDoc
     */
    componentWillUnmount(): void;
    /**
     * @inheritDoc
     */
    render(): null;
}
