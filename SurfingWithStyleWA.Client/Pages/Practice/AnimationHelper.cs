using Microsoft.JSInterop;
using System;

namespace SurfingWithStyleWA.Client.Pages.Practice
{
    public class AnimationHelper
    {
        Action<string> SetAnimationState;

        public AnimationHelper(Action<string> setAnimationState)
        {
            this.SetAnimationState = setAnimationState;
        }

        [JSInvokable]
        public void SetAnimationToRunning()
        {
            SetAnimationState("running");
        }

        [JSInvokable]
        public void SetAnimationToStoppingLR()
        {
            SetAnimationState("stopping-lr");
        }

        [JSInvokable]
        public void SetAnimationToStoppingRL()
        {
            SetAnimationState("stopping-rl");
        }

        [JSInvokable]
        public void SetAnimationToStopped()
        {
            SetAnimationState("stopped");
        }
    }
}
