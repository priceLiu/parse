using MySpider.Common;
using MySpider.Model;
using MySpider.Model.Manager;
using MySpider.MQ.Model;
using ParseMachine;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Manager
{
    public class CrawlManager
    {
        /// <summary>
        /// 1. download
        /// 2. save page
        /// 3. save data file
        /// 4. send to MQ 
        /// 5. move site's file to next step
        /// </summary>
        /// <param name="model"></param>
        /// <param name="?"></param>
        public void Process(WebSiteModel model, string dataFilePath)
        {
            WebSiteModel newModel = WebSiteManager.GetSiteInfo(dataFilePath);
            HtmlHelper helper = new HtmlHelper();

            foreach (UrlModel item in newModel.DownloadUrls)
            {
                string url = item.Url;
                string readyRoot = "c:\\";
                string tmpFileName = string.Format("{0}.html", FileHelper.GenerateFileName(url));
                string targetPath = string.Format("{0}{1}", readyRoot, tmpFileName);
                string dataContent = JsonHelper.JsonSerializer(model);

                helper.Download(url);
                bool isSuccess = helper.SaveTo(helper.M_Html, targetPath);

                try
                {
                    if (isSuccess)
                    {
                        FileInfo info = new FileInfo(dataFilePath);
                        string dataSavePath = string.Format("{0}{1}", readyRoot, info.Name);
                        
                        helper.SaveTo(dataContent, dataSavePath);
                        MSMQManager.InstanceLocalComputer.Send<string>(string.Format("{0},{1}", dataSavePath, targetPath), new BinaryMessageFormatter());

                        string parseRoot = "c:\\parse\\";
                        MoveFile(targetPath, parseRoot);
                    }
                }
                catch (Exception ex)
                {
                    LogHelper.WriteLog(ex);
                }
                finally
                {
                    MSMQManager.InstanceLocalComputer.Dispose();
                }
            }
        }

        public void MoveFile(string sourceFileName, string destFileName)
        {
            FileHelper.MoveTo(sourceFileName, destFileName);
        }
    }
}
