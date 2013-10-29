using MySpider.Common;
using MySpider.Model.Manager;
using ParseMachine;
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
            List<UrlModel> urls = new List<UrlModel>(){
                UrlManager.CreateModel("http://yongche.16888.com/mrzs/index_1_1.html","美容知识"),
                UrlManager.CreateModel("http://yongche.16888.com/yfzs/index_1_1.html","养护知识"),
                UrlManager.CreateModel("http://yongche.16888.com/gzzs/index_1_1.html","改装知识"),
                UrlManager.CreateModel("http://yongche.16888.com/cjzs/index_1_1.html","车居知识"),
                UrlManager.CreateModel("http://yongche.16888.com/cyp/index_1_1.html","汽车用品"),
                UrlManager.CreateModel("http://yongche.16888.com/bszh/index_1_1.html","保险知识"),
                UrlManager.CreateModel("http://yongche.16888.com/wxzs/index_1_1.html","维修知识")
            };

            RuleModel rule = RuleManager.CreateModel("//dt[1]//a[2]", "//div[@class='news_list']//dl",
                                                        "//dt[1]//a[@class='f_gray']", "//dt[1]//span[@class='ico_j']",
                                                        "//dd[1]//span[1]", "//dd[1]//img[1]", "//dt[1]//span[@class='f_r']");
                

            WebSiteModel model = WebSiteManager.CreateModel(urls, rule,new Uri("http://www.cn100.com"));


            string result = JsonHelper.Serializer(model);
            FileHelper.WriteTo(result,"c:\\bb.html");
            WebSiteModel newModel = WebSiteManager.GetSiteInfo("c:\\bb.html");
        }
    }
}
