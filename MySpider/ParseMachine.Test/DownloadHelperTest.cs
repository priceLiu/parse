using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySpider.Common;
using MySpider.Model;
using MySpider.Model.Manager;
using NUnit;
using MySpider.Manager;

namespace ParseMachine.Test
{
    [NUnit.Framework.TestFixture]
    public class DownloadHelperTest
    {
        [NUnit.Framework.Test]
        public void Test1()
        {
            //string content = DownloadHelper.Download("");
            //DownloadHelper.ParseIndexPage("http://yongche.16888.com/index.html");
            //DownloadHelper download = new DownloadHelper();
            //download.DownloadFromRequest("http://yongche.16888.com/index.html");

            //string targetPath = "c:\\a.html";




            //1. write website rule
            //2. save website info or send it to MQ queue
            /*List<UrlModel> urls = new List<UrlModel>(){
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


            WebSiteModel model = WebSiteManager.CreateModel(urls, rule, "addr");*/

            WebSiteModel model = CreateTestModel();

            string result = JsonHelper.Serializer(model);
            FileHelper.WriteTo(result, "c:\\bb.data");
            



            //2. download from url
            //3. save result

            WebSiteModel newModel = WebSiteManager.GetSiteInfo("c:\\bb.data");
            HtmlHelper helper = new HtmlHelper();
            List<string> targetPaths = new List<string>();

            foreach (UrlModel item in newModel.DownloadUrls)
            {
                string url = item.Url;
                string localDriver = "c:\\";
                string targetPath = string.Format("{0}{1}.html", localDriver, FileHelper.GenerateFileName(url));

                helper.Download(url);
                helper.SaveTo(helper.M_Html, targetPath);

                targetPaths.Add(targetPath);
            }

            



            //4. pase page from local file
            WebSiteModel parseModel = WebSiteManager.GetSiteInfo("c:\\bb.data");
            YongcheHtmlHelper yongche = new YongcheHtmlHelper();
            string tempContent = System.IO.File.ReadAllText(targetPaths[0], Encoding.Default);
            List<Article> articles = yongche.ParseArticle(tempContent, parseModel);
        }

        [NUnit.Framework.Test]
        public void CrawTest()
        {
            WebSiteModel model = CreateTestModel();
            CrawlManager manager = new CrawlManager();

            string result = JsonHelper.Serializer(model);
            FileHelper.WriteTo(result, "c:\\" + model.RuleFileName);

            manager.Process(model, "c:\\" + model.RuleFileName); 
        }

        private WebSiteModel CreateTestModel()
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


            WebSiteModel model = WebSiteManager.CreateModel(urls, rule, new Uri("http://yongche.16888.com"));

            return model;
        }

        [NUnit.Framework.Test]
        public void ParseTest()
        {
            ParseThreadMgt mgt = new ParseThreadMgt();
            mgt.ReceiveMSMQ();
        }

        [NUnit.Framework.Test]
        public void CreateTest()
        {
            FileHelper.MoveTo(@"c:\yongche.16888.com.data", @"c:\parse\yongche 16888 com\yongche.16888.com.data");
        }
    }
}
