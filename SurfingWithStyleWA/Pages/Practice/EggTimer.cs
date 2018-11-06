using Microsoft.JSInterop;
using System;

namespace SurfingWithStyleWA.Pages.Practice
{
    class EggTimer
    {
        public string ButtonFace = "oi-media-play";
        public TimeSpan TimeRemaining = new TimeSpan(0, 2, 0);
        public DateTime TargetTime = DateTime.Now;
        public string TimerDisplay = "2:00";

        private Action StateHasChanged;
        private Action OnTimerTick;
        private Action OnTimerExpired;
        System.Timers.Timer timer = new System.Timers.Timer(1000);

        private bool _isRunning = false;
        public bool IsRunning
        {
            get
            {
                return _isRunning;
            }
            set
            {
                _isRunning = value;

                if (_isRunning)
                {
                    this.ButtonFace = "oi-media-pause";
                    Start();
                }
                else
                {
                    this.ButtonFace = "oi-media-play";
                    timer.Stop();
                }
            }
        }

        public EggTimer(Action stateHasChanged)
        {
            this.StateHasChanged = stateHasChanged;
        }

        public void Initialize(Action onTimerTick, Action onTimerExpired)
        {
            this.OnTimerTick = onTimerTick;
            this.OnTimerExpired = onTimerExpired;
            timer.Elapsed += OnTimer;
        }

        private string RoundAndTrimDuration(TimeSpan span)
        {
            const double factor = 10000000;
            long boundedTicks = Math.Max(span.Ticks, 0);
            long roundedTicks = (long)(Math.Round(boundedTicks / factor) * factor);
            TimeSpan roundedTimeSpan = new TimeSpan(roundedTicks);
            string str = roundedTimeSpan.ToString();
            int i = 0;

            for (i = 0; i < str.Length - 4; i++)
            {
                if (str[i] != '0' && str[i] != ':')
                    break;
            }

            return str.Substring(i);
        }

        private void Start()
        {
            this.TargetTime = DateTime.Now + this.TimeRemaining;
            JSRuntime.Current.InvokeAsync<object>("uncolorBody");
            this.TimerDisplay = RoundAndTrimDuration(this.TimeRemaining);
            timer.Start();
        }

        public void OnTimer(Object source, System.Timers.ElapsedEventArgs e)
        {
            this.TimeRemaining = this.TargetTime - DateTime.Now;
            this.TimerDisplay = RoundAndTrimDuration(this.TimeRemaining);
            JSRuntime.Current.InvokeAsync<object>("setTitle", this.TimerDisplay);
            this.OnTimerTick();

            if (this.TimerDisplay == "0:00")
            {
                TimerExpired();
            }

            this.StateHasChanged();
        }

        public void TimerExpired()
        {
            this.TargetTime = DateTime.Now;
            timer.Stop();
            this.OnTimerExpired();
        }

        public void Dispose()
        {
            timer.Elapsed -= OnTimer;
        }
    }
}
