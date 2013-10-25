using MySpider.Common;
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
            WebSiteModel model = new WebSiteModel();

            model.DownloadUrls = new List<UrlModel>(){
                new UrlModel{ 
                    Url = "http://yongche.16888.com/mrzs/index_1_1.html",
                    Desc = "美容知识"
                },
                new UrlModel{ 
                    Url = "http://yongche.16888.com/yfzs/index_1_1.html",
                    Desc = "养护知识"
                },
                new UrlModel{ 
                    Url = "http://yongche.16888.com/gzzs/index_1_1.html",
                    Desc = "改装知识"
                },
                new UrlModel{ 
                    Url = "http://yongche.16888.com/cjzs/index_1_1.html",
                    Desc = "车居知识"
                },
                new UrlModel{ 
                    Url = "http://yongche.16888.com/cyp/index_1_1.html",
                    Desc = "汽车用品"
                },
                new UrlModel{ 
                    Url = "http://yongche.16888.com/bszh/index_1_1.html",
                    Desc = "保险知识"
                },
                new UrlModel{ 
                    Url = "http://yongche.16888.com/wxzs/index_1_1.html",
                    Desc = "维修知识"
                }
            };

            model.SourceAddress = "1";
            model.SourceKeywords = "bb";
            model.Rule = new RuleModel{
                ArticleXPath = "//div[@class='news_list']//dl",
                CreatedXPath = "//dt[1]//span[@class='f_r']",
                ImageXPath = "//dd[1]//img[1]",
                RecomendXPath = "//dt[1]//span[@class='ico_j']",
                TitleXPath = "//dt[1]//a[2]",
                TypeXPath = "//dt[1]//a[@class='f_gray']",
                SummaryXPath = "//dd[1]//span[1]"
            };


            string result = JsonHelper.JsonSerializer(model);
            FileHelper.WriteTo(result,"c:\\bb.html");
            WebSiteModel newModel = YongcheHtmlHelper.GetSiteInfo("c:\\bb.html");
        }
    }
}
