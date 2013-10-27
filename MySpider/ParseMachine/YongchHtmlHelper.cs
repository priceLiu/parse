using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using MySpider.Model;

namespace ParseMachine
{
    public class YongcheHtmlHelper : HtmlHelper, IArticleHelper
    {
        public List<Article> ParseArticle(string html,WebSiteModel websiteModel)
        {
            HtmlNodeCollection categoryNodeList = HtmlHelper.GetCategoryNodes(html, websiteModel.Rule.ArticleXPath);
            HtmlDocument document = new HtmlDocument();
            List<Article> articles = new List<Article>();

            foreach (HtmlNode item in categoryNodeList)
            {
                document.LoadHtml(item.InnerHtml);
                HtmlNode node = document.DocumentNode;

                Article article = new Article();
                article.Title = node.SelectNodes(websiteModel.Rule.TitleXPath)[0].OuterHtml;
                article.Type = Tools.ConvertType(node.SelectNodes(websiteModel.Rule.TypeXPath)[0].InnerHtml);
                article.IsRecommend = node.SelectNodes(websiteModel.Rule.RecomendXPath) != null;
                article.Summary = node.SelectNodes(websiteModel.Rule.SummaryXPath)[0].OuterHtml;
                article.Created = Convert.ToDateTime(node.SelectNodes(websiteModel.Rule.CreatedXPath)[0].InnerHtml);
                
                ImgLink img = new ImgLink();
                img.Src = node.SelectNodes(websiteModel.Rule.ImageXPath)[0].Attributes["src"].Value;
                img.NavigateUrl = string.Empty;
                img.Alt = node.SelectNodes(websiteModel.Rule.ImageXPath)[0].Attributes["alt"] == null
                        ? string.Empty : node.SelectNodes(websiteModel.Rule.ImageXPath)[0].Attributes["alt"].Value;

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

        public int GetPageMaxSize(string html, string pageSizeXPath)
        {
            HtmlNodeCollection categoryNodeList = HtmlHelper.GetCategoryNodes(html, pageSizeXPath);
            return Convert.ToInt16(categoryNodeList[categoryNodeList.Count - 2].InnerHtml);
        }
    }
}