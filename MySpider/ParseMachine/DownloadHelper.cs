using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HtmlAgilityPack;
using System.Net;
using System.IO;
using System.Text.RegularExpressions;
using MyDownloader.Core;
using MyDownloader.Extension.Protocols;

namespace ParseMachine
{
    public class DownloadHelper
    {
        private static string CategoryListXPath = "//div[@class='news_list']//dl";
        private static string CategoryNameXPath = "//li[1]/a[1]";

        #region 私有成员
        private Uri m_uri;   //url   
        private string m_title;        //标题  
        private string m_html;         //HTML代码  
        private string m_outstr;       //网页可输出的纯文本  
        private bool m_good;           //网页是否可用  
        private int m_pagesize;       //网页的大小  
        private static Dictionary<string, CookieContainer> webcookies = new Dictionary<string, CookieContainer>();//存放所有网页的Cookie  

        #endregion

        #region 属性

        /// <summary>  
        /// 通过此属性可获得本网页的网址，只读  
        /// </summary>  
        public string URL
        {
            get
            {
                return m_uri.AbsoluteUri;
            }
        }

        /// <summary>  
        /// 通过此属性可获得本网页的标题，只读  
        /// </summary>  
        public string Title
        {
            get
            {
                if (m_title == "")
                {
                    Regex reg = new Regex(@"(?m)<title[^>]*>(?<title>(?:\w|\W)*?)</title[^>]*>", RegexOptions.Multiline | RegexOptions.IgnoreCase);
                    Match mc = reg.Match(m_html);
                    if (mc.Success)
                        m_title = mc.Groups["title"].Value.Trim();
                }
                return m_title;
            }
        }
        public string M_html
        {
            get
            {
                if (m_html == null)
                {
                    m_html = "";
                }
                return m_html;
            }
        }


        /// <summary>  
        /// 此属性返回本网页的全部纯文本信息，只读  
        /// </summary>  
        public string Context
        {
            get
            {
                if (m_outstr == "")
                {
                    getContext(Int16.MaxValue);
                }

                return m_outstr;
            }
        }

        /// <summary>  
        /// 此属性获得本网页的大小  
        /// </summary>  
        public int PageSize
        {
            get
            {
                return m_pagesize;
            }
        }

        /// <summary>  
        /// 此属性表示本网页是否可用  
        /// </summary>  
        public bool IsGood
        {
            get
            {
                return m_good;
            }
        }
        /// <summary>  
        /// 此属性表示网页的所在的网站  
        /// </summary>  
        public string Host
        {
            get
            {
                return m_uri.Host;
            }
        }
        #endregion

        public static void ParseIndexPage(string url)
        {
            Uri uriCategory = null;
            //List<Category> list = new List<Category>(40);

            HtmlDocument document = new HtmlDocument();
            Stream str = DownloadFromWebClient(url);

            document.Load(str, Encoding.UTF8);
            HtmlNode rootNode = document.DocumentNode;


            var count = rootNode.ChildNodes.Count;
            foreach (HtmlNode node in rootNode.ChildNodes)
            {
                var item = node;
            }

            HtmlNodeCollection categoryNodeList = rootNode.SelectNodes(CategoryListXPath);

            foreach (HtmlNode categoryNode in categoryNodeList)
            {
                string content = categoryNode.InnerHtml;

                //document.LoadHtml(content);

                //HtmlNode node = document.DocumentNode;
                //HtmlNodeCollection items = node.SelectNodes("\\img");
            }


            HtmlNode temp = null;
            /*Category category = null;
            foreach (HtmlNode categoryNode in categoryNodeList)
            {
                temp = HtmlNode.CreateNode(categoryNode.OuterHtml);
                if (temp.SelectSingleNode(CategoryNameXPath).InnerText != "全部文章")
                {
                    category = new Category();
                    category.Subject = temp.SelectSingleNode(CategoryNameXPath).InnerText;
                    Uri.TryCreate(UriBase, temp.SelectSingleNode(CategoryNameXPath).Attributes["href"].Value, out uriCategory);
                    category.IndexUrl = uriCategory.ToString();
                    category.PageUrlFormat = category.IndexUrl + "/page/{0}";
                    list.Add(category);
                    Category.CategoryDetails.Add(category.IndexUrl, category);
                }
            }
            return list;*/



        }

        public static Stream DownloadFromWebClient(string url)
        {
            System.Net.WebClient client = new WebClient();
            byte[] page = client.DownloadData(url);
            //return System.Text.Encoding.UTF8.GetString(page);  

            Stream stream = new MemoryStream(page);
            return stream;
        }

        public void DownloadFromRequest(string url)
        {
            string uurl = "";
            try
            {
                uurl = Uri.UnescapeDataString(url);
                url = uurl;
            }
            catch { };

            download(url);
        }

        public string getContext(int firstN)
        {
            return getFirstNchar(m_html, firstN, true);
        }

        private void download(string url)
        {
            try
            {
                m_uri = new Uri(url);
                m_html = "";
                m_outstr = "";
                m_title = "";
                m_good = true;

                if (url.EndsWith(".rar") || url.EndsWith(".dat") || url.EndsWith(".msi"))
                {
                    m_good = false;
                    return;
                }

                HttpWebRequest rqst = (HttpWebRequest)WebRequest.Create(m_uri);
                rqst.Timeout = 30000;
                
                //rqst.AllowAutoRedirect = true;
                //rqst.MaximumAutomaticRedirections = 3;
                //rqst.UserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.0.3705;)";
                //rqst.KeepAlive = true;
                //rqst.Method = "GET";
                //rqst.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
                //rqst.Headers.Add("Accept-Language: en-us,en;q=0.5");
                //rqst.Headers.Add("Accept-Encoding: gzip,deflate");
                //rqst.Headers.Add("Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7");
                //rqst.Referer = m_uri.Host;

                lock (DownloadHelper.webcookies)
                {
                    if (DownloadHelper.webcookies.ContainsKey(m_uri.Host))
                        rqst.CookieContainer = DownloadHelper.webcookies[m_uri.Host];
                    else
                    {
                        CookieContainer cc = new CookieContainer();
                        DownloadHelper.webcookies[m_uri.Host] = cc;
                        
                        rqst.CookieContainer = cc;
                    }
                }

                HttpWebResponse rsps = (HttpWebResponse)rqst.GetResponse();
                
                Stream sm = rsps.GetResponseStream();
                if (!rsps.ContentType.ToLower().StartsWith("text/") || rsps.ContentLength > 1 << 22)
                {
                    rsps.Close();
                    m_good = false;
                    return;
                }

                Encoding cding = System.Text.Encoding.Default;
                string contenttype = rsps.ContentType.ToLower();
                int ix = contenttype.IndexOf("charset=");

                if (ix != -1)
                {
                    try
                    {
                        cding = System.Text.Encoding.GetEncoding(rsps.ContentType.Substring(ix + "charset".Length + 1));
                    }
                    catch
                    {
                        cding = Encoding.Default;
                    }

                    //m_html = HttpUtility.HtmlDecode(new StreamReader(sm, cding).ReadToEnd());  
                    m_html = new StreamReader(sm, cding).ReadToEnd();

                }
                else
                { 
                    //m_html = HttpUtility.HtmlDecode(new StreamReader(sm, cding).ReadToEnd());  

                    m_html = new StreamReader(sm, cding).ReadToEnd();
                    Regex regex = new Regex("charset=(?<cding>[^=]+)?\"", RegexOptions.IgnoreCase);
                    string strcding = regex.Match(m_html).Groups["cding"].Value;

                    try
                    {
                        cding = Encoding.GetEncoding(strcding);
                    }
                    catch
                    {
                        cding = Encoding.Default;
                    }

                    byte[] bytes = Encoding.Default.GetBytes(m_html.ToCharArray());
                    m_html = cding.GetString(bytes);

                    if (m_html.Split('?').Length > 100)
                    {
                        m_html = Encoding.Default.GetString(bytes);
                    }
                }

                m_pagesize = m_html.Length;
                m_uri = rsps.ResponseUri;
                rsps.Close();
            }
            catch (Exception ex)
            {

            }
        }

        private string getFirstNchar(string instr, int firstN, bool withLink)
        {
            if (m_outstr == "")
            {
                m_outstr = instr.Clone() as string;
                m_outstr = new Regex(@"(?m)<script[^>]*>(\w|\W)*?</script[^>]*>", RegexOptions.Multiline | RegexOptions.IgnoreCase).Replace(m_outstr, "");
                m_outstr = new Regex(@"(?m)<style[^>]*>(\w|\W)*?</style[^>]*>", RegexOptions.Multiline | RegexOptions.IgnoreCase).Replace(m_outstr, "");
                m_outstr = new Regex(@"(?m)<select[^>]*>(\w|\W)*?</select[^>]*>", RegexOptions.Multiline | RegexOptions.IgnoreCase).Replace(m_outstr, "");
                if (!withLink) m_outstr = new Regex(@"(?m)<a[^>]*>(\w|\W)*?</a[^>]*>", RegexOptions.Multiline | RegexOptions.IgnoreCase).Replace(m_outstr, "");
                Regex objReg = new System.Text.RegularExpressions.Regex("(<[^>]+?>)| ", RegexOptions.Multiline | RegexOptions.IgnoreCase);
                m_outstr = objReg.Replace(m_outstr, "");
                Regex objReg2 = new System.Text.RegularExpressions.Regex("(\\s)+", RegexOptions.Multiline | RegexOptions.IgnoreCase);
                m_outstr = objReg2.Replace(m_outstr, " ");

            }
            return m_outstr.Length > firstN ? m_outstr.Substring(0, firstN) : m_outstr;
        }


        public static void Down()
        {
            ResourceLocation rl = new ResourceLocation();
            rl.Authenticate = false;
            rl.Login = string.Empty;
            rl.Password = string.Empty;
            rl.URL = "http://www.cnblogs.com/wenyang-rio/archive/2013/01/09/2850893.html";

            string localFile = "c:\\1.html";
            int segments = 1;

            ProtocolProviderFactory.RegisterProtocolHandler("http", typeof(HttpProtocolProvider));
            ProtocolProviderFactory.RegisterProtocolHandler("https", typeof(HttpProtocolProvider));
            ProtocolProviderFactory.RegisterProtocolHandler("ftp", typeof(FtpProtocolProvider));

            rl.BindProtocolProviderType();
            ResourceLocation[] mirrors = new ResourceLocation[1];
            mirrors[0] = MyDownloader.Core.ResourceLocation.FromURL(rl.URL,
                            false,
                            string.Empty,
                            string.Empty);

            Downloader download = DownloadManager.Instance.Add(
                        rl,
                        mirrors,
                        localFile,
                        segments,
                        false);


            download.Start();
        }
    }
}
