namespace SurfingWithStyleWA.Client.Pages.Tools
{
    partial class Constants
    {
        public const string ERROR = "ERROR";
        public const string FORMAT = "#,##0.##";
    }

    interface IWeight
    {
        void Convert(ref string kilos, ref string grams, ref string stone, ref string pounds, ref string ounces);
    }

    class SimpleMeasure
    {
        public double UnitVal { get; private set; }

        public SimpleMeasure(string unit)
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

    class Kilo : SimpleMeasure, IWeight
    {
        public Kilo(string kilos) : base(kilos) { }

        public void Convert(ref string kilos, ref string grams, ref string stone, ref string pounds, ref string ounces)
        {
            double g = 1000.0 * this.UnitVal;
            double oz = 0.03527396 * g;
            double lb = 0.0625 * oz;
            Stone s = new Stone(lb);
            grams = g.ToString(Constants.FORMAT);
            stone = s.ToString();
            pounds = lb.ToString(Constants.FORMAT);
            ounces = oz.ToString(Constants.FORMAT);
        }
    }

    class Gram : SimpleMeasure, IWeight
    {
        public Gram(string grams) : base(grams) { }

        public void Convert(ref string kilos, ref string grams, ref string stone, ref string pounds, ref string ounces)
        {
            double oz = 0.03527396 * this.UnitVal;
            double lb = 0.0625 * oz;
            Stone s = new Stone(lb);
            kilos = (this.UnitVal / 1000).ToString(Constants.FORMAT);
            stone = s.ToString();
            pounds = lb.ToString(Constants.FORMAT);
            ounces = oz.ToString(Constants.FORMAT);
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

        public void Convert(ref string kilos, ref string grams, ref string stone, ref string pounds, ref string ounces)
        {
            double lb = 14 * StoneVal + PoundVal;
            double oz = 16 * lb;
            double g = 28.3495231 * oz;
            kilos = (g / 1000).ToString(Constants.FORMAT);
            grams = g.ToString(Constants.FORMAT);
            pounds = lb.ToString();
            ounces = oz.ToString(Constants.FORMAT);
        }

        public override string ToString()
        {
            if (this.StoneVal >= 0)
                return string.Format("{0} stone {1}", this.StoneVal, this.PoundVal.ToString(Constants.FORMAT));
            else
                return Constants.ERROR;
        }
    }

    class Pound : SimpleMeasure, IWeight
    {
        public Pound(string pounds) : base(pounds) { }

        public void Convert(ref string kilos, ref string grams, ref string stone, ref string pounds, ref string ounces)
        {
            Stone s = new Stone(UnitVal);
            double oz = 16 * this.UnitVal;
            double g = 28.3495231 * oz;
            kilos = (g / 1000).ToString(Constants.FORMAT);
            grams = g.ToString(Constants.FORMAT);
            stone = s.ToString();
            ounces = oz.ToString(Constants.FORMAT);
        }
    }

    class Ounce : SimpleMeasure, IWeight
    {
        public Ounce(string pounds) : base(pounds) { }

        public void Convert(ref string kilos, ref string grams, ref string stone, ref string pounds, ref string ounces)
        {
            double g = 28.3495231 * this.UnitVal;
            double lb = this.UnitVal / 16;
            Stone s = new Stone(lb);
            kilos = (g / 1000).ToString(Constants.FORMAT);
            grams = g.ToString(Constants.FORMAT);
            stone = s.ToString();
            pounds = lb.ToString(Constants.FORMAT);
        }
    }
}
