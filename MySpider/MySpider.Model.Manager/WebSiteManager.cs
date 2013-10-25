using MySpider.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Model.Manager
{
    public class WebSiteManager
    {
        public static WebSiteModel GetSiteInfo(string filePath)
        {
            string content = FileHelper.ReadAllText(filePath, Encoding.Default);
            return JsonHelper.JsonDeserialize<WebSiteModel>(content);
        }
    }
}
