using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit;

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

            //HtmlHelper helper = new HtmlHelper();

            //all , page start 1_1 , page end 1_90
            //helper.Download("http://yongche.16888.com/index_1_1.html");


            //http://yongche.16888.com/mrzs/index_1_1.html
            //http://yongche.16888.com/yfzs/index_1_1.html
            //http://yongche.16888.com/wxzs/index_1_1.html
            //http://yongche.16888.com/gzzs/index_1_1.html
            //http://yongche.16888.com/cjzs/index_1_1.html
            //http://yongche.16888.com/cyp/index_1_1.html
            //http://yongche.16888.com/bszh/index_1_1.html


            YongcheHtmlHelper yongche = new YongcheHtmlHelper();

            string tempContent = System.IO.File.ReadAllText(@"C:\test.html",Encoding.Default);

            yongche.ParseArticle(tempContent, "//div[@class='news_list']//dl");
        }
    }
}
