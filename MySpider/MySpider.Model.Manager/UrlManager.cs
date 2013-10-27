using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Model.Manager
{
    public class UrlManager
    {
        public static UrlModel CreateModel(string url, string desc)
        {
            UrlModel model = new UrlModel();

            model.Url = url;
            model.Desc = desc;

            return model;
        }
    }
}
