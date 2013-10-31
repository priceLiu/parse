
namespace ParseMachine
{
    public class ImgLink : ILink
    {
        public class Attributes
        {
            public const string ALT = "alt";
            public const string SRC = "src";
        }

        public string Src
        {
            get;
            set;
        }

        public string NavigateUrl
        {
            get;
            set;
        }

        public string Alt
        {
            get;
            set;
        }
    }
}
