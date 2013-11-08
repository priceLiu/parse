using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using Peanut;

namespace MySpider.BLL.Test
{
    [TestFixture]
    public class ArticleTest
    {
        [Test]
        public void InsertTest()
        {
            ArticleManager manager = new ArticleManager();

            MySpider.DAL.Model.ArticleDBModel item = manager.ConvertToDalModel(new MySpider.BLL.Model.ArticleModel
            {
                Title = "tt",
                Summary = "test 1",
                Created = DateTime.Now
            });
            

            DBContext.Save(item); 
        }
    }
}
