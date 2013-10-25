﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParseMachine
{
    public class Article
    {
        public string Title
        {
            get;
            set;
        }

        public ArticleType Type
        {
            get;
            set;
        }

        public string Summary
        {
            get;
            set;
        }

        public bool IsRecommend
        {
            get;
            set;
        }

        public ImgLink ImgLink
        {
            get;
            set;
        }

        public string NavUrl
        {
            get;
            set;
        }

        public int StarCount
        {
            get;
            set;
        }

        public int BrowsedCount
        {
            get;
            set;
        }

        public string Posted
        {
            get;
            set;
        }

        public DateTime Created
        {
            get;
            set;
        }
    }

    public enum ArticleType
    {
        Maintain = 1,
        Cosmetology = 2,
        Repair = 3,
        Remodel = 4,
        Safety = 5,
        Articles = 6
    }
}
