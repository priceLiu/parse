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
    public class HtmlHelper
    {
        private List<Link> m_links;
        private DownloadHelper download;

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
                    getLinks();
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
                return download.Title;
            }
        }
        public string M_html
        {
            get
            {
                return download.M_html;
            }
        }


        /// <summary>  
        /// 此属性返回本网页的全部纯文本信息，只读  
        /// </summary>  
        public string Context
        {
            get
            {
                return download.Context;
            }
        }

        /// <summary>  
        /// 此属性获得本网页的大小  
        /// </summary>  
        public int PageSize
        {
            get
            {
                return download.PageSize; ;
            }
        }

        /// <summary>  
        /// 此属性表示本网页是否可用  
        /// </summary>  
        public bool IsGood
        {
            get
            {
                return download.IsGood;
            }
        }
        /// <summary>  
        /// 此属性表示网页的所在的网站  
        /// </summary>  
        public string Host
        {
            get
            {
                return download.Host;
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
            download = new DownloadHelper();
            download.DownloadFromRequest(Uri.UnescapeDataString(downloadUrl));

            if (IsGood)
            {
                URI = new Uri(downloadUrl);
            }

            return download.IsGood;
        }

        private List<Link> getInnerSiteImages(string html)
        {
            HtmlDocument document = new HtmlDocument();
            document.LoadHtml(html);

            HtmlNode rootNode = document.DocumentNode;
            HtmlNodeCollection categoryNodeList = rootNode.SelectNodes("//img");

            foreach (var item in categoryNodeList)
            {

            }

            return null;
        }

        public List<Link> getSpecialImages(string html, string customXPath)
        {
            HtmlDocument document = new HtmlDocument();
            document.LoadHtml(html);

            HtmlNode rootNode = document.DocumentNode;
            HtmlNodeCollection categoryNodeList = rootNode.SelectNodes(customXPath);

            StringBuilder outerHtml = new StringBuilder();

            foreach (HtmlNode item in categoryNodeList)
            {
                outerHtml.AppendFormat("{0} \r\n",item.OuterHtml);
            }

            return getInnerSiteImages(outerHtml.ToString());
        }


        //TODO: replace this method
        private List<Link> getSpecialLinksByUrl(string pattern, int count)
        {
            if (m_links.Count == 0)
            {
                getLinks();
            }

            List<Link> SpecialLinks = new List<Link>();
            List<Link>.Enumerator i;
            i = m_links.GetEnumerator();
            int cnt = 0;
            while (i.MoveNext() && cnt < count)
            {
                if (new Regex(pattern, RegexOptions.Multiline | RegexOptions.IgnoreCase).Match(i.Current.NavigateUrl).Success)
                {
                    SpecialLinks.Add(i.Current);
                    cnt++;
                }
            }
            return SpecialLinks;
        }

        private List<Link> getLinks()
        {
            if (m_links.Count == 0)
            {
                Regex[] regex = new Regex[4];
                regex[0] = new Regex(@"<a\shref\s*=""(?<URL>[^""]*).*?>(?<title>[^<]*)</a>", RegexOptions.IgnoreCase | RegexOptions.Singleline);
                regex[1] = new Regex("<[i]*frame[^><]+src=(\"|')?(?<url>([^>\"'\\s)])+)(\"|')?[^>]*>", RegexOptions.IgnoreCase);
                regex[2] = new Regex("<img(?:.*)src=(\"{1}|\'{1})([^\\[^>]+[gif|jpg|jpeg|bmp|bmp|png]*)(\"{1}|\'{1})(?:.*)>", RegexOptions.IgnoreCase);
                regex[3] = new Regex(@"<script[^>]*?>.*?</script>", RegexOptions.IgnoreCase);

                for (int i = 0; i < 4; i++)
                {
                    Match match = regex[i].Match(M_html);
                    while (match.Success)
                    {
                        try
                        {
                            string url = HttpUtility.UrlDecode(new Uri(URI, match.Groups["URL"].Value).AbsoluteUri);

                            string text = "";

                            if (i == 0)
                            {
                                text = new Regex("(<[^>]+>)|(\\s)|( )|&|\"", RegexOptions.Multiline | RegexOptions.IgnoreCase).Replace(match.Groups["text"].Value, "");
                            }

                            Link link = new Link();
                            link.Text = text;
                            link.NavigateUrl = url;
                            link.Tag = match.Groups[0].Value.Split(' ')[0].Remove(0, 1);
                            link.Src = string.Empty;

                            if (link.Tag == "img")
                            {
                                link.Src = match.Groups[2].Value;
                            }

                            m_links.Add(link);
                        }
                        catch (Exception ex) { Console.WriteLine(ex.Message); };
                        match = match.NextMatch();
                    }
                }
            }
            return m_links;
        }
    }
}
