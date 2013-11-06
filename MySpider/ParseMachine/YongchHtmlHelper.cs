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

            int i = 0;

            foreach (HtmlNode item in categoryNodeList)
            {
                Article article = new Article();
                article.Title = item.SelectNodes(websiteModel.Rule.TitleXPath)[i].OuterHtml;
                article.Type = Tools.ConvertType(item.SelectNodes(websiteModel.Rule.TypeXPath)[i].InnerHtml);
                article.IsRecommend = item.SelectNodes(websiteModel.Rule.RecomendXPath) != null;
                article.Summary = item.SelectNodes(websiteModel.Rule.SummaryXPath)[i].OuterHtml;
                article.Created = Convert.ToDateTime(item.SelectNodes(websiteModel.Rule.CreatedXPath)[i].InnerHtml);
                
                ImgLink img = new ImgLink();
                img.Src = item.SelectNodes(websiteModel.Rule.ImageXPath)[i].Attributes[ImgLink.Attributes.SRC.ToString()].Value;
                img.NavigateUrl = string.Empty;
                img.Alt = item.SelectNodes(websiteModel.Rule.ImageXPath)[i].Attributes[ImgLink.Attributes.ALT.ToString()] == null
                        ? string.Empty : item.SelectNodes(websiteModel.Rule.ImageXPath)[i].Attributes[ImgLink.Attributes.ALT.ToString()].Value;

                article.ImgLink = img;
                articles.Add(article);

                i++;
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