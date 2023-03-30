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

// region imports

import * as React from 'react';

// endregion

// region local types

/**
 * Callback type
 */
export type UFKeyboardCallback = (key: string, shift: boolean, ctrl: boolean, alt: boolean) => any;

// endregion

// region component

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
export class UFKeyboard extends React.Component<UFKeyboardProps> {
  // region keys

  static readonly ESCAPE = 'Escape';

  // endregion

  // region private methods

  /**
   * Calls a callback if there is any and the key matches keys (if there are any).
   *
   * @param anEvent
   *   Event to process
   * @param aCallback
   *   Callback to call
   */
  private callCallback(anEvent: KeyboardEvent, aCallback?: UFKeyboardCallback) {
    if (aCallback) {
      if (this.props.keys) {
        if (Array.isArray(this.props.keys)) {
          if (!this.props.keys.includes(anEvent.key)) {
            return;
          }
        }
        else if (this.props.keys != anEvent.key) {
          return;
        }
      }
      aCallback(anEvent.key, anEvent.shiftKey, anEvent.ctrlKey, anEvent.altKey);
    }
  }

  // endregion

  // region event handlers

  /**
   * Handles key down events.
   */
  private handleKeyDown = (anEvent: KeyboardEvent) => {
    this.callCallback(anEvent, this.props.onDown);
  };

  /**
   * Handles key up events.
   */
  private handleKeyUp = (anEvent: KeyboardEvent) => {
    this.callCallback(anEvent, this.props.onUp);
  };

  // endregion

  // region react callbacks

  /**
   * @inheritDoc
   */
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  /**
   * @inheritDoc
   */
  render() {
    return null;
  }

  // endregion
}
