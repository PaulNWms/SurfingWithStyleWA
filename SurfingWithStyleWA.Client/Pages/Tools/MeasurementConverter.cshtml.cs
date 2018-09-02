using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SurfingWithStyleWA.Client.Pages.Tools
{
    partial class Constants
    {
        public const string ERROR = "ERROR";
        public const string FORMAT = "0.##";
    }

    class Stone
    {
        public Stone(double pounds)
        {
            this.StoneVal = (int)(pounds / 14);
            this.PoundVal = pounds % 14;
        }

        public Stone(string stone)
        {
            var regex = new System.Text.RegularExpressions.Regex(@"^(\d+)(\s*stone\s*(\d+(\.\d+)?))?$");
            var matches = regex.Match(stone);

            if (matches.Success)
            {
                this.StoneVal = (int)double.Parse(matches.Groups[1].Value);
                this.PoundVal = double.Parse("0" + matches.Groups[3].Value);
            }
            else
            {
                this.StoneVal = -1;
                this.PoundVal = -1.0;
            }
        }

        public int StoneVal { get; private set; }
        public double PoundVal { get; private set; }
        public double ToPounds() { return 14 * StoneVal + PoundVal; }
        public double ToKilos() { return 0.4536 * ToPounds(); }
        public override string ToString()
        {
            if (this.StoneVal >= 0)
                return string.Format("{0} stone {1}", this.StoneVal, this.PoundVal.ToString(Constants.FORMAT));
            else
                return Constants.ERROR;
        }
    }
}
