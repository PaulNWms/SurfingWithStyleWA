namespace SurfingWithStyleWA.Pages.Practice
{
    class MiniMetronome
    {
        public const int MIN_TEMPO = 20;
        public const int MAX_TEMPO = 240;

        public string Animation = "none";
        public string Duration = "0s";
        public string PlayState = "running";
        public string State = "stopped";

        private int _tempo = 120;
        public int Tempo
        {
            get
            {
                return _tempo;
            }
            set
            {
                _tempo = value;

                if (_tempo < MIN_TEMPO)
                {
                    IsRunning = false;
                }
                else
                    Duration = ((int)(60000.0 / _tempo)).ToString() + "ms";

                SetAnimation();
            }
        }

        public string TempoDisplay
        {
            get
            {
                return (_tempo >= 0) ? _tempo.ToString() : "";
            }
        }

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

                if (Tempo < MIN_TEMPO)
                {
                    _isRunning = false;
                }

                SetAnimation();
            }
        }

        public void SetAnimation()
        {
            if (IsRunning)
            {
                Animation = "starting";
            }
        }
    }
}
