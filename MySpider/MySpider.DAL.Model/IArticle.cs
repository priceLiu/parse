using Peanut.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.DAL.Model
{
    [Table("Article")]
    interface IArticle
    {
        [ID]
        int Id
        {
            get;
            set;
        }

        [Column]
        string Title
        {
            get;
            set;
        }

        [Column]
        string Summary
        {
            get;
            set;
        }

        [Column]
        bool IsRecommend
        {
            get;
            set;
        }

        [Column]
        string NavUrl
        {
            get;
            set;
        }

        [Column]
        int StarCount
        {
            get;
            set;
        }

        [Column]
        int BrowsedCount
        {
            get;
            set;
        }

        [Column]
        string Posted
        {
            get;
            set;
        }

        [Column]
        DateTime Created
        {
            get;
            set;
        }
    }

    public partial class Article
    {
        public ArticleType Type
        {
            get;
            set;
        }

        public ImgLink ImgLink
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
