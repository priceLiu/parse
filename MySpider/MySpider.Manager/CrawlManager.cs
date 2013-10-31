using MySpider.Common;
using MySpider.Model;
using MySpider.Model.Manager;
using MySpider.MQ.Model;
using ParseMachine;
using System;
using System.Messaging;

namespace MySpider.Manager
{
    public class CrawlManager
    {
        /// <summary>
        /// 1. download page
        /// 2. save page
        /// 3. send info to MQ 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="?"></param>
        public void Process(WebSiteModel model, string dataFilePath)
        {
            string readyRoot = "c:\\ready\\";

            HtmlHelper helper = new HtmlHelper();
            WebSiteModel newModel = WebSiteManager.GetSiteInfo(dataFilePath);

            foreach (UrlModel item in newModel.DownloadUrls)
            {
                string url = item.Url;
                
                string tmpFileName = string.Format("{0}{1}", FileHelper.GenerateFileName(url), 
                                                    FileHelper.DOWNLOAD_FILE_EXTENSION);
                string targetPath = string.Format("{0}{1}", readyRoot,  tmpFileName);

                helper.Download(url);
                bool isSuccess = helper.SaveTo(helper.M_Html, targetPath);

                try
                {
                    if (isSuccess)
                    {
                        string msgContent = string.Format("{0},{1}", dataFilePath, targetPath);
                        SendMsg(msgContent);
                    }
                }
                catch (Exception ex)
                {
                    LogHelper.WriteLog(ex);
                }
            }

            MSMQManager.InstanceLocalComputer.Dispose();
        }

        private void MoveDataFile(string sourceFileName, string destFileName)
        {
            FileHelper.MoveTo(sourceFileName, destFileName);
        }

        public void SendMsg(string msgContent)
        {
            MSMQManager.InstanceLocalComputer.Send(msgContent, new BinaryMessageFormatter());
        }
    }
}
