namespace SurfingWithStyleWA.Client.Pages.Tools
{
    partial class Constants
    {
        public const string ERROR = "ERROR";
        public const string FORMAT = "0.##";
    }

    interface IWeight
    {
        void Convert(ref string kilos, ref string pounds, ref string stone);
    }

    class Weight
    {
        public double UnitVal { get; private set; }

        public Weight(string unit)
        {
            try { UnitVal = double.Parse(unit); }
            catch { UnitVal = double.NaN; }
        }

        public override string ToString()
        {
            if (this.UnitVal >= 0)
                return this.UnitVal.ToString(Constants.FORMAT);
            else
                return Constants.ERROR;
        }
    }

    class Kilo : Weight, IWeight
    {
        public Kilo(string kilos) : base(kilos) { }

        public void Convert(ref string kilos, ref string pounds, ref string stone)
        {
            double p = this.UnitVal * 2.2046;
            Stone s = new Stone(p);
            pounds = p.ToString(Constants.FORMAT);
            stone = s.ToString();
        }
    }

    class Pound : Weight, IWeight
    {
        public Pound(string pounds) : base(pounds) { }

        public void Convert(ref string kilos, ref string pounds, ref string stone)
        {
            Stone s = new Stone(UnitVal);
            kilos = (this.UnitVal * 0.4536).ToString(Constants.FORMAT);
            stone = s.ToString();
        }
    }

    class Stone : IWeight
    {
        public int StoneVal { get; private set; }
        public double PoundVal { get; private set; }

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
                this.PoundVal = double.NaN;
            }
        }

        public void Convert(ref string kilos, ref string pounds, ref string stone)
        {
            double p = 14 * StoneVal + PoundVal;
            pounds = p.ToString();
            kilos = (p * 0.4536).ToString(Constants.FORMAT);
        }

        public override string ToString()
        {
            if (this.StoneVal >= 0)
                return string.Format("{0} stone {1}", this.StoneVal, this.PoundVal.ToString(Constants.FORMAT));
            else
                return Constants.ERROR;
        }
    }
}
