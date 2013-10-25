using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace ParseMachine
{
    public class HtmlHelper : IArticleHelper
    {
        private List<Link> m_links;
        private DownloadHelper m_download;
        private string m_imgXPath = "//img";
        private string m_srcXPath = "//src";

        #region 属性

        public Uri URI
        {
            get;
            set;
        }

        public List<Link> Links
        {
            get
            {
                if (m_links.Count == 0)
                {
                    //getLinks();
                }

                return m_links;
            }
        }

        /// <summary>  
        /// 通过此属性可获得本网页的网址，只读  
        /// </summary>  
        public string URL
        {
            get
            {
                return URI.AbsoluteUri;
            }
        }

        /// <summary>  
        /// 通过此属性可获得本网页的标题，只读  
        /// </summary>  
        public string Title
        {
            get
            {
                return m_download.Title;
            }
        }
        public string M_Html
        {
            get
            {
                return m_download.M_html;
            }
        }


        /// <summary>  
        /// 此属性返回本网页的全部纯文本信息，只读  
        /// </summary>  
        public string Context
        {
            get
            {
                return m_download.Context;
            }
        }

        /// <summary>  
        /// 此属性获得本网页的大小  
        /// </summary>  
        public int PageSize
        {
            get
            {
                return m_download.PageSize; ;
            }
        }

        /// <summary>  
        /// 此属性表示本网页是否可用  
        /// </summary>  
        public bool IsGood
        {
            get
            {
                return m_download.IsGood;
            }
        }
        /// <summary>  
        /// 此属性表示网页的所在的网站  
        /// </summary>  
        public string Host
        {
            get
            {
                return m_download.Host;
            }
        }

        /// <summary>  
        /// 此属性获得本网页的所有站内链接  
        /// </summary>  
        public List<Link> InnerLinks
        {
            get
            {
                //return getSpecialLinksByUrl("^http://" + URI.Host, Int16.MaxValue);
                //return getInnerSiteImages("", 1);
                return null;
            }
        }

        
        #endregion

        public HtmlHelper()
        {
            m_links = new List<Link>();
        }

        public bool Download(string downloadUrl)
        {
            m_download = new DownloadHelper();
            m_download.DownloadFromRequest(Uri.UnescapeDataString(downloadUrl));

            if (IsGood)
            {
                URI = new Uri(downloadUrl);
            }

            return m_download.IsGood;
        }

        public virtual List<ImgLink> getSpecialImages(string sourceHTML, string labelXPath)
        {
            StringBuilder builder = new StringBuilder();
            HtmlNodeCollection categoryNodeList = GetCategoryNodes(sourceHTML, labelXPath);

            foreach (HtmlNode item in categoryNodeList)
            {
                builder.Append(item.OuterHtml);
            }

            return getInnerSiteImages(builder.ToString());
        }

        private List<ImgLink> getInnerSiteImages(string html)
        {
            HtmlNodeCollection categoryNodeList = GetCategoryNodes(html, m_imgXPath);

            foreach (HtmlNode item in categoryNodeList)
            {
                ImgLink imgLink = new ImgLink();
                HtmlNodeCollection srcList = item.SelectNodes(m_srcXPath);
            }

            return null;
        }

        public static HtmlNodeCollection GetCategoryNodes(string sourceHtml, string articleXPath)
        {
            HtmlDocument document = new HtmlDocument();
            document.LoadHtml(sourceHtml);

            HtmlNode rootNode = document.DocumentNode;
            HtmlNodeCollection categoryNodeList = rootNode.SelectNodes(articleXPath);
            return categoryNodeList;
        }

        public List<Article> ParseArticle(string html, string articleXPath)
        {
            return new List<Article>();
        }
    }
}
