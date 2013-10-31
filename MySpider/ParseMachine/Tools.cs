using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParseMachine
{
    public class Tools
    {
        public static ArticleType ConvertType(string chnDesc)
        {
            ArticleType type = ArticleType.Appliance;

            switch (chnDesc)
            {
                case ArticleTypeDesc.MAINTAIN:
                    type = ArticleType.Maintain;
                    break;
                case ArticleTypeDesc.COSMETOLOGY:
                    type = ArticleType.Cosmetology;
                    break;
                case ArticleTypeDesc.REPAIR:
                    type = ArticleType.Repair;
                    break;
                case ArticleTypeDesc.REMODEL:
                    type = ArticleType.Remodel;
                    break;
                case ArticleTypeDesc.SAFETY:
                    type = ArticleType.Safety;
                    break;
            }

            return type;
        }
    }

    public class ArticleTypeDesc
    {
        public const string MAINTAIN = "养护";
        public const string COSMETOLOGY = "美容";
        public const string REPAIR = "维修";
        public const string REMODEL = "改装";
        public const string SAFETY = "保养";
        public const string ARTICLES = "用品";
    }
}
