using MySpider.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace MySpider.Model.Manager
{
    public class WebSiteManager
    {
        public static WebSiteModel GetSiteInfo(string filePath)
        {
            string content = FileHelper.ReadAllText(filePath, Encoding.Default);
            return JsonHelper.JsonDeserialize<WebSiteModel>(content);
        }

        public static WebSiteModel CreateModel(List<UrlModel> downloadUrls, RuleModel rule, 
                                                string sourceAddress)
        {
            WebSiteModel model = new WebSiteModel();

            model.DownloadUrls = downloadUrls;
            model.Rule = rule;
            model.SourceAddress = sourceAddress;

            return model;
        }
    }
}
