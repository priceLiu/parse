using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParseMachine
{
    public class YongcheHtmlHelper : HtmlHelper
    {
        public List<Article> ParseArticle(string html,string articleXPath)
        {
            HtmlNodeCollection categoryNodeList = HtmlHelper.GetCategoryNodes(html, articleXPath);
            HtmlDocument document = new HtmlDocument();
            List<Article> articles = new List<Article>();

            foreach (HtmlNode item in categoryNodeList)
            {
                document.LoadHtml(item.InnerHtml);
                HtmlNode node = document.DocumentNode;

                Article article = new Article();
                article.Title = node.SelectNodes("//dt[1]//a[2]")[0].OuterHtml;
                article.Type = Tools.ConvertType(node.SelectNodes("//dt[1]//a[@class='f_gray']")[0].InnerHtml);
                article.IsRecommend = node.SelectNodes("//dt[1]//span[@class='ico_j']") != null;
                article.Summary = node.SelectNodes("//dd[1]//span[1]")[0].OuterHtml;
                article.Created = Convert.ToDateTime(node.SelectNodes("//dt[1]//span[@class='f_r']")[0].InnerHtml);
                
                ImgLink img = new ImgLink();
                img.Src = node.SelectNodes("//dd[1]//img[1]")[0].Attributes["src"].Value;
                img.NavigateUrl = string.Empty;
                img.Alt = node.SelectNodes("//dd[1]//img[1]")[0].Attributes["alt"] == null
                        ? string.Empty : node.SelectNodes("//dd[1]//img[1]")[0].Attributes["alt"].Value;

                article.ImgLink = img;

                articles.Add(article);
            }

            return articles;
        }

        public List<Article> ConverArticles(HtmlNodeCollection collection)
        {
            foreach (var item in collection)
            {
            }

            return null;
        }
    }
}

/*

                <dt><span class="f_r">2013-10-24</span><a class="f_gray" href="/wxzs/index.html">【维修知识】</a><a href="http://news.16888.com/a/2013/1024/286887.html" target="_blank">路上漏油怎么办?教你十个应急修理方法</a><span class="ico_j"><!-- 推荐图标 --></span></dt>
                <dd>
                	<img src="http://image.16888.com/upload/Images/2013/10/2013102410201388301.jpg_120.jpg" onerror="this.src='http://image.16888.com/default120.jpg_120.jpg'">
                    <span><a href="http://news.16888.com/a/2013/1024/286887.html" target="_blank">阅读全文&gt;&gt;</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      【车主之家用车知识】驾车外出难免会出现一些故障。假如行驶中出现故障或有故障而暂时无零配件供应又需急用的情况，我们不得不采取一些应急的修理方法。现将一些简便而易行的应急修理方法介绍如下：1.油箱损伤机动车在使用时，发现油箱漏油，可将漏油处擦干...</span>
                </dd>*/