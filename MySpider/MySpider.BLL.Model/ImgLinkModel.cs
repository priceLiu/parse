using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.BLL.Model
{
    public class ImgLinkModel
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
