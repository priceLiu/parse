using MySpider.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParseMachine
{
    public interface IArticleHelper
    {
        List<Article> ParseArticle(string html, WebSiteModel websiteModel);
        int GetPageMaxSize(string html, string pageSizeXPath);
    }
}
