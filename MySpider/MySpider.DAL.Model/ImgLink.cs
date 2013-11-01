using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.DAL.Model
{
    public class ImgLink
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
