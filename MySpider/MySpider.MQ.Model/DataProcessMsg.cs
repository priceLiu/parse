using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.MQ.Model
{
    [Serializable]
    public class DataProcessMsg
    {
        public string Path
        {
            get;
            set;
        }

        public string SourceFileName
        {
            get;
            set;
        }
    }
}
