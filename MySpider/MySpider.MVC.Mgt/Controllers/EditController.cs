using MySpider.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MySpider.MVC.Mgt.Controllers
{
    public class EditController : Controller
    {
        //
        // GET: /Edit/

        public ActionResult Index()
        {
            WebSiteModel siteModel = new WebSiteModel();
            siteModel.DownloadUrls = new List<UrlModel>();

            return View(siteModel);
        }

        public ActionResult AddWebSite()
        {
            return View();
        }
    }
}
