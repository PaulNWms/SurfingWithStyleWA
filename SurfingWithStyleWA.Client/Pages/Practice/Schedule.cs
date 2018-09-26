using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SurfingWithStyleWA.Client.Pages.Practice
{
    class Schedule
    {
        private enum TimerState { Stopped, Running, Paused, StartNext, Settling };
        private System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex(@"(\d+):(\d\d)");
        private System.Text.RegularExpressions.Match match;

        public bool StartWithRest;
        public bool EndWithBell;
        public string ExerciseMarkup;
        public List<Exercise> timeline;
        public Exercise CurrentStep;
        public Exercise LastStep;
        public string ExerciseDisplay;

        private Action StateHasChanged;
        private TimerState status = TimerState.Stopped;
        private Uri uri;
        private EggTimer eggTimer;
        private MiniMetronome metronome;
        private List<Exercise> exercises;

        private TimeSpan rest;
        public string RestDisplay
        {
            get
            {
                return ((int)rest.TotalSeconds).ToString();
            }
            set
            {
                match = regex.Match(value);
                int seconds;

                if (match.Success)
                {
                    int minutes = int.Parse(match.Groups[1].Value);
                    seconds = int.Parse(match.Groups[2].Value);
                    rest = new TimeSpan(0, minutes, seconds);
                }
                else if (int.TryParse(value, out seconds))
                {
                    rest = new TimeSpan(0, 0, seconds);
                }
                else
                {
                    JSRuntime.Current.InvokeAsync<object>("alert", "what?  " + value);
                }
            }

        }

        public Schedule(Action stateHasChanged, Uri uri)
        {
            this.StateHasChanged = stateHasChanged;
            this.uri = uri;
            this.rest = new TimeSpan(0, 0, 5);
            this.StartWithRest = true;
            this.EndWithBell = true;
            ParseUrl();
        }

        public void Initialize(EggTimer eggTimer, MiniMetronome metronome)
        {
            this.eggTimer = eggTimer;
            this.metronome = metronome;
        }

        public async void OnPlayPause()
        {
            switch (status)
            {
                case TimerState.Stopped:
                    try
                    {
                        if (timeline == null || timeline.Count == 0)
                        {
                            await ParseControls();
                            this.timeline = this.ToTimeline();

                            if (timeline.Count == 0)
                            {
                                return;
                            }
                        }

                        this.status = TimerState.StartNext;
                        Update();
                        this.StateHasChanged();
                    }
                    catch (Exception e)
                    {
                        await JSRuntime.Current.InvokeAsync<object>("alert", e.Message + e.StackTrace);
                    }
                    break;

                case TimerState.Paused:
                    status = TimerState.Running;
                    eggTimer.IsRunning = true;
                    metronome.PlayState = "running";
                    break;

                case TimerState.Running:
                    status = TimerState.Paused;
                    eggTimer.IsRunning = false;
                    metronome.PlayState = "paused";
                    eggTimer.OnTimer(null, null);
                    break;

                default:
                    Update();
                    break;
            }
        }

        public async void CreateLink()
        {
            try
            {
                await ParseControls();
                string url = ToUrl();
                await JSRuntime.Current.InvokeAsync<object>("window.open", url);
            }
            catch (Exception e)
            {
                await JSRuntime.Current.InvokeAsync<object>("alert", e.Message + e.StackTrace);
            }
        }

        public void Update()
        {
            switch (status)
            {
                case TimerState.StartNext:
                    this.LastStep = this.CurrentStep;
                    this.CurrentStep = timeline[0];
                    timeline.RemoveAt(0);
                    this.ExerciseDisplay = this.CurrentStep.Description;
                    this.metronome.Tempo = this.CurrentStep.Tempo;
                    this.metronome.IsRunning = this.metronome.Tempo >= MiniMetronome.MIN_TEMPO;
                    this.eggTimer.TimeRemaining = this.CurrentStep.Duration;
                    this.eggTimer.IsRunning = true;
                    this.status = TimerState.Running;
                    break;

                case TimerState.Settling:
                    this.status = TimerState.Running;
                    break;

                default:
                    break;
            }
        }

        public void LineCompleted()
        {
            if (timeline.Count > 0)
            {
                if (this.EndWithBell && CurrentStep.Tempo != -1)
                {
                    JSRuntime.Current.InvokeAsync<object>("playAudio", ".audio-end-exercise");
                }

                status = TimerState.StartNext;
                Update();
            }
            else
            {
                if (this.EndWithBell)
                {
                    JSRuntime.Current.InvokeAsync<object>("playAudio", ".audio-end-routine");
                }

                metronome.Tempo = 0;
                metronome.IsRunning = false;
                eggTimer.IsRunning = false;
                status = TimerState.Stopped;
                JSRuntime.Current.InvokeAsync<object>("colorBody");
                this.ExerciseDisplay = "Done!";
            }
        }

        public async Task ParseControls()
        {
            int minutes;
            int seconds;
            exercises = new List<Exercise>();
            List<List<string>> raw = await JSRuntime.Current.InvokeAsync<List<List<string>>>("getExerciseValues");

            if (raw[0].Count != raw[1].Count || raw[1].Count != raw[2].Count)
            {
                throw new DataMisalignedException(string.Format("Lists are different lengths: {0} {1} {2}", raw[0].Count, raw[1].Count, raw[3].Count));
            }

            for (int i = 0; i < raw[0].Count; i++)
            {
                int tempo;
                TimeSpan duration;

                if (int.TryParse(raw[0][i], out tempo))
                {
                    match = regex.Match(raw[1][i]);

                    if (match.Success)
                    {
                        minutes = int.Parse(match.Groups[1].Value);
                        seconds = int.Parse(match.Groups[2].Value);
                        duration = new TimeSpan(0, minutes, seconds);
                    }
                    else if (int.TryParse(raw[1][i], out seconds))
                    {
                        duration = new TimeSpan(0, 0, seconds);
                    }
                }

                if (duration.Ticks == 0)
                {
                    throw new ArgumentException(string.Format("Invalid time format: {0}", raw[1][i]));
                }

                exercises.Add(new Exercise() { Tempo = tempo, Duration = duration, Description = raw[2][i] });
            }
        }

        private void ParseUrl()
        {
            var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(this.uri.Query);
            int[] tempos = null;
            TimeSpan[] durations = null;
            string[] exes = null;
            exercises = new List<Exercise>();

            if (query.ContainsKey("r"))
            {
                foreach (var key in query.Keys)
                {
                    switch (key)
                    {
                        case "r":
                            this.RestDisplay = query["r"].ToString();
                            break;

                        case "s":
                            bool.TryParse(query["s"].ToString(), out this.StartWithRest);
                            break;

                        case "b":
                            bool.TryParse(query["b"].ToString(), out this.EndWithBell);
                            break;

                        case "t":
                            {
                                string[] strs = query["t"].ToString().Split('-');
                                List<int> ts = new List<int>(strs.Length);

                                foreach (string str in strs)
                                {
                                    int tempo;

                                    if (int.TryParse(str, out tempo))
                                    {
                                        ts.Add(tempo);
                                    }
                                    else
                                    {
                                        ts.Add(120);
                                    }
                                }

                                tempos = ts.ToArray();
                            }
                            break;

                        case "d":
                            {
                                string[] strs = query["d"].ToString().Split('-');
                                List<TimeSpan> durs = new List<TimeSpan>(strs.Length);

                                foreach (string str in strs)
                                {
                                    int sec;

                                    if (int.TryParse(str, out sec))
                                    {
                                        durs.Add(new TimeSpan(0, 0, sec));
                                    }
                                    else
                                    {
                                        durs.Add(new TimeSpan(0, 0, 120));
                                    }
                                }

                                durations = durs.ToArray();
                            }
                            break;

                        case "e":
                            exes = query["e"].ToString().Split('-');

                            for (int i = 0; i < exes.Length; i++)
                            {
                                exes[i] = exes[i].Replace("%26", "&");
                                exes[i] = exes[i].Replace("%2D", "-");
                            }
                            break;
                    }
                }

                for (int i = 0; i < tempos.Length; i++)
                {
                    this.exercises.Add(new Exercise() { Tempo = tempos[i], Duration = durations[i], Description = exes[i] });
                }
            }
            else
            {
                this.exercises.Add(new Exercise() { Tempo = 120, Duration = new TimeSpan(0, 2, 0), Description = string.Empty });
            }
        }

        public List<Exercise> ToTimeline()
        {
            List<Exercise> timeline = new List<Exercise>();
            var restStep = new Exercise() { Tempo = -1, Duration = this.rest, Description = "Resting..." };

            if (exercises.Count > 0 && this.rest.Ticks > 0 && this.StartWithRest)
            {
                timeline.Add(restStep);
            }

            for (var i = 0; i < exercises.Count; i++)
            {
                timeline.Add(exercises[i]);

                if (i < exercises.Count - 1 && this.rest.Ticks > 0)
                {
                    timeline.Add(restStep);
                }
            }

            return timeline;
        }

        public string ToUrl()
        {
            List<int> tempos = new List<int>(exercises.Count);
            List<TimeSpan> durations = new List<TimeSpan>(exercises.Count);
            List<string> descriptions = new List<string>(exercises.Count);

            foreach (var exercise in exercises)
            {
                tempos.Add(exercise.Tempo);
                durations.Add(exercise.Duration);
                descriptions.Add(exercise.Description);
            }

            string ts = string.Join("-", tempos);
            string ds = string.Join("-", durations.Select(d => (int)d.TotalSeconds));
            string es = string.Join("-", descriptions.Select(e =>
                Uri.EscapeUriString(e.Replace("&", "%26").Replace("-", "%2D"))
            ));

            return String.Format(URL_TEMPLATE, uri.AbsolutePath,
                ((int)this.rest.TotalSeconds).ToString(),
                this.StartWithRest.ToString().ToLower(),
                this.EndWithBell.ToString().ToLower(),
                ts, ds, es);
        }

        public string ToHtml()
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            foreach (var exercise in exercises)
            {
                sb.AppendLine(string.Format(HTML_TEMPLATE,
                    exercise.Tempo,
                    exercise.Duration.ToString(@"m\:ss"),
                    exercise.Description));
            }

            return sb.ToString();
        }

        const string URL_TEMPLATE = "{0}?r={1}&s={2}&b={3}&t={4}&d={5}&e={6}";

        public const string HTML_TEMPLATE = @"                        <tr>
            <td>
                <button type='button' class='btn btn-primary delete-schedule-row'><span class='oi oi-x'></span></button>
            </td>
            <td>
                <input type='text' class='form-control digit-filter tempo tempo-0' placeholder='Tempo' autocomplete='off' value='{0}' />
            </td>
            <td>
                <input type='text' class='form-control time-filter midpoint midpoint-0' placeholder='Duration' autocomplete='off' value='{1}' />
            </td>
            <td>
                <input type='text' class='form-control exercise' placeholder='Exercise' value='{2}' />
            </td>
            <td>
                <button type='button' class='btn btn-primary add-schedule-row' onclick='@AddRow'><span class='oi oi-plus'></span></button>
            </td>
        </tr>";
    }
}
