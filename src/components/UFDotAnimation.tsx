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
 * State for component
 *
 * @private
 */
interface UFDotAnimationState {
  dotCount: number;
}

// endregion

// region component

/**
 * {@link UFDotAnimation} shows an animation of 1 to 3 dots, changing every 500ms.
 */
export class UFDotAnimation extends React.Component<{},UFDotAnimationState> {
  // region private variables

  /**
   * Timer handle.
   *
   * @private
   */
  private m_timer: ReturnType<typeof setInterval> | null;

  // endregion

  // region constructor

  constructor(aProps: any) {
    super(aProps);
    this.m_timer = null;
    this.state = {
      dotCount: 3
    }
  }

  // endregion

  // region event handlers

  handleTimerTick() {
    this.setState({
      dotCount: (this.state.dotCount + 1) % 4
    });
  }

  // endregion

  // region react callbacks

  componentDidMount() {
    this.m_timer = setInterval(() => this.handleTimerTick(), 500);
  }

  componentWillUnmount() {
    if (this.m_timer != null) {
      clearInterval(this.m_timer);
      this.m_timer = null;
    }
  }

  render() {
    const dots = '........'.substring(0, this.state.dotCount);
    return (
      <React.Fragment>
        {dots}
      </React.Fragment>
    );
  }

  // endregion
}

// endregion
