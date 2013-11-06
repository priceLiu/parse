using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.BLL.Model
{
    public class ArticleModel
    {
        public ArticleType Type
        {
            get;
            set;
        }

        public ImgLinkModel ImgLink
        {
            get;
            set;
        }

        public string Title
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
        Maintain = 1,       //养护
        Cosmetology = 2,    //美容
        Repair = 3,         //维修
        Remodel = 4,        //改装
        Safety = 5,         //保险
        Appliance = 6       //用品
    }
}
