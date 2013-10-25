using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Model
{
    public class WebSiteModel
    {
        public List<string> DownloadUrls
        {
            get;
            set;
        }

        public RuleModel Rule
        {
            get;
            set;
        }

        public string SourceKeywords
        {
            get;
            set;
        }

        public string SourceAddress
        {
            get;
            set;
        }
    }
}
