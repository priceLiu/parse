using Peanut.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.DAL.Model
{
    [Table("Article")]
    interface IArticleDBModel
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
}
