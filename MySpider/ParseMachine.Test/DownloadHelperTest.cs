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

            //helper.Download("http://yongche.16888.com/index_1_1.html");
            //http://yongche.16888.com/bszh/index_1_1.html


            YongcheHtmlHelper yongche = new YongcheHtmlHelper();

            string tempContent = System.IO.File.ReadAllText(@"C:\test.html",Encoding.Default);

            yongche.ParseArticle(tempContent, "//div[@class='news_list']//dl");
        }
    }
}
