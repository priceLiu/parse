﻿using System.Collections.Generic;

namespace MySpider.Model
{
    public class WebSiteModel
    {
        public List<UrlModel> DownloadUrls
        {
            get;
            set;
        }

        public RuleModel Rule
        {
            get;
            set;
        }

        public List<string> SourceKeywords
        {
            get
            {
                List<string> keywords = new List<string>();

                foreach (UrlModel model in DownloadUrls)
                {
                    if (!string.IsNullOrEmpty(model.Desc))
                    {
                        string item = model.Desc;
                        keywords.Add(item);
                    }
                }

                return keywords;
            }
        }

        public string SourceAddress
        {
            get;
            set;
        }
    }
}