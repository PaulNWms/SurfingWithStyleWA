using Microsoft.JSInterop;
using System;

namespace SurfingWithStyleWA.Client.Pages.Practice
{
    public class AnimationHelper
    {
        Action<string> SetAnimationName;

        public AnimationHelper(Action<string> setAnimationName)
        {
            this.SetAnimationName = setAnimationName;
        }

        [JSInvokable]
        public void SetAnimationToSwing()
        {
            SetAnimationName("swing");
        }
    }
}
