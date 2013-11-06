using BLL = MySpider.BLL.Model;
using MySpider.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL = MySpider.DAL.Model;
using Peanut;

namespace MySpider.BLL
{
    public class ArticleManager
    {
        public List<BLL.Model.ArticleModel> ReadData()
        {
            string content = FileHelper.ReadAllText(@"C:\parse result\yongche 16888 com\yongche.16888.com bszh index_1_1.html.result", Encoding.UTF8);
            var items = JsonHelper.DeserializeSingle<List<BLL.Model.ArticleModel>>(content);

            return items;
        }

        public DAL.Model.ArticleDBModel ConvertToDalModel(BLL.Model.ArticleModel model)
        {
            DAL.Model.ArticleDBModel dbModel = new DAL.Model.ArticleDBModel();
            model.MemberCopyTo(dbModel);

            return dbModel;
        }
    }
}
