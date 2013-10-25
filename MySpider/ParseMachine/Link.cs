using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParseMachine
{
    public class Link : ILink
    {
        public string Tag
        {
            get;
            set;
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

        public string Text
        {
            get;
            set;
        }
    }
}
