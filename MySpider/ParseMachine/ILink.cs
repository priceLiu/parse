using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParseMachine
{
    interface ILink
    {
        string NavigateUrl
        {
            get;
            set;
        }
    }
}
