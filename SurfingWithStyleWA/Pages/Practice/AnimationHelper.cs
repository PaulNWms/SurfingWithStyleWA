using Microsoft.JSInterop;
using System;

namespace SurfingWithStyleWA.Pages.Practice
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
        public void SetAnimationToRunningRL()
        {
            SetAnimationState("running-rl");
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
