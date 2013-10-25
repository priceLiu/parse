using MySpider.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Model.Test
{
    [NUnit.Framework.TestFixture]
    public class WebSiteModelTest
    {
        [NUnit.Framework.Test]
        public void JsonTest()
        {
            WebSiteModel model = new WebSiteModel();

            model.DownloadUrls = new List<string>(){
                "aaaaaa",
                "bbbb" 
            };

            model.SourceAddress = "1";
            model.SourceKeywords = "bb";
            model.Rule = new RuleModel{
                ArticleXPath = "article",
                CreatedXPath = "created",
                ImageXPath = "image",
                RecomendXPath = "reomend"
            };


            string result = JsonHelper.JsonSerializer(model);
        }
    }
}
