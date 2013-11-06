using MySpider.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MySpider.Web.MVC.Controllers
{
    public class ContentController : Controller
    {
        //
        // GET: /ContentList/

        public ActionResult List()
        {
            ArticleManager manager = new ArticleManager();
            var result = manager.ReadData();


            return View(result);
        }

    }
}
