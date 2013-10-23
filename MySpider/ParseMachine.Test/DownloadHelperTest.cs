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

            HtmlHelper helper = new HtmlHelper();

            helper.Download("http://yongche.16888.com/index.html");
            List<Link> items = helper.InnerLinks;

            helper.getSpecialImages(helper.M_html, "//div[@class='news_list']");
        }
    }
}
