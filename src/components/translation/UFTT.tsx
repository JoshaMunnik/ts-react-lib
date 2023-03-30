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
import {IUFDynamicObject} from "@ultraforce/ts-general-lib/dist/types/IUFDynamicObject";
import {UFTranslationContext} from "../../contexts/UFTranslationContext";

// endregion

// region component

/**
 * Properties for {@link UFTT}
 */
export interface UFTTProps {
  /**
   * The id to find text for. When not set, use the content as id.
   */
  readonly ttid?: string;

  /**
   * When true parse the translated text through a html parser to create a correct React structure.
   */
  readonly html?: boolean;

  /**
   * When set, replace the keys with their values in the translated or default text.
   */
  readonly map?: IUFDynamicObject;

  /**
   * Child elements
   */
  readonly children?: React.ReactNode;
}

/**
 * {@link UFTT} is a translatable text component.
 */
export const UFTT: React.FC<UFTTProps> = (
  {
    children, ttid, html = false,
    map
  }
) => {
  return (
    <UFTranslationContext.Consumer>
      {(
        ({translate}) => translate(ttid, children, html, map)
      )}
    </UFTranslationContext.Consumer>
  )
};

// endregion