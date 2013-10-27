using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Model.Manager
{
    public class RuleManager
    {
        public static RuleModel CreateModel(string titleXPath, string articleXPath, string typeXPath, 
                                            string recomendXPath , string summaryXPath, string imageXPath, 
                                            string createdXPath)
        {
            RuleModel model = new RuleModel();

            model.TitleXPath = titleXPath;
            model.ArticleXPath = articleXPath;
            model.TypeXPath = titleXPath;
            model.RecomendXPath = recomendXPath;
            model.SummaryXPath = summaryXPath;
            model.ImageXPath = imageXPath;
            model.CreatedXPath = createdXPath;

            return model;
        }
    }
}
