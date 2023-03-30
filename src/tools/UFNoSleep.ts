/**
 * @version 1
 * @author Josha Munnik
 * @copyright Copyright (c) 2016 Ultra Force Development
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

// region NoSleep.js

/**
 * Type wrapper for NoSleep instances
 */
interface INoSleep {
  enable(): void;
  disable(): void;
}

/**
 * Maps to Javascript's NoSleep constructor function
 */
declare var NoSleep: any;

/**
 * A typescript wrapper for NoSleep.js
 *
 * Usage:
 * - do not install NoSleep.js via npm, but get the distribution version
 * - copy the version to somewhere in the public folder
 * - load the minified or normal distribution version in public/index.html
 */
export class UFNoSleep {
  // region static private variables

  /**
   * Will be assigned a value the first NoSleep is accessed.
   *
   * @private
   */
  private static s_noSleep: INoSleep;

  // endregion

  // region static methods

  /**
   * Maps to the enable method from NoSleep.js
   */
  static enable(): void {
    console.log('UFNoSleep', 'enable');
    //UFNoSleep.noSleep.enable();
  }

  /**
   * Maps to the disable method from NoSleep.js
   */
  static disable(): void {
    console.log('UFNoSleep', 'disable');
    //UFNoSleep.noSleep.disable();
  }

  /**
   * Click wrapper handler to enable or disable no sleep.
   *
   * @param aHandler
   *   A click handler that should be called.
   * @param anEnable
   *   True to enable no sleep, false to disable it
   *
   * @returns a click handler that will enable or disable no sleep and then call aHandler.
   */
  static click(aHandler: () => void, anEnable: boolean = true): () => void {
    return () => {
      if (anEnable) {
        UFNoSleep.enable();
      }
      else {
        UFNoSleep.disable();
      }
      return aHandler();
    }
  }

  // endregion

  // region private static properties

  /**
   * Reference to static NoSleep instance created via the NoSleep constructor function.
   *
   * @private
   */
  private static get noSleep() {
    if (!UFNoSleep.s_noSleep) {
      UFNoSleep.s_noSleep = new NoSleep();
    }
    return UFNoSleep.s_noSleep;
  }

  // endregion
}

// endregion
