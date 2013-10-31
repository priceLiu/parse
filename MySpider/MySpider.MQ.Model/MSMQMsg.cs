using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.MQ.Model
{
    [Serializable]
    public class MSMQMsg
    {
        public string RuleFileName
        {
            get;
            set;
        }

        public string DownloadedFileName
        {
            get;
            set;
        }
    }
}
