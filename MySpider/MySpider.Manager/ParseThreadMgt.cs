using MySpider.Common;
using MySpider.Model;
using MySpider.Model.Manager;
using MySpider.MQ.Model;
using ParseMachine;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;

namespace MySpider.Manager
{
    public class ParseThreadMgt : IDisposable
    {
        private Thread _receiveMSMQThread = null;

        private static ParseThreadMgt _instance = new ParseThreadMgt();
        /// <summary>
        /// 初始化
        /// </summary>
        public static ParseThreadMgt Instance
        {
            get { return ParseThreadMgt._instance; }
            set { ParseThreadMgt._instance = value; }
        }

        public void Start()
        {
            StartReceiveMSMQThread();
        }

        public void Stop()
        {
            Dispose();
        }

        private void StartReceiveMSMQThread()
        {
            _receiveMSMQThread = new Thread(new ThreadStart(ReceiveMSMQ));
            _receiveMSMQThread.Name = "ReceiveThread";
            _receiveMSMQThread.IsBackground = true;
            _receiveMSMQThread.Start();
        }

        public void ReceiveMSMQ()
        {
            object obj = null;
            MSMQManager.InstanceLocalComputer.Create(true);

            while (true)
            {
                try
                {
                    obj = MSMQManager.InstanceLocalComputer.ReceiveBinaryMsg();
                    string [] fileName = obj.ToString().Split(','); // file[0] data path,  file[1] html path

                    string dataFileName = fileName[0];
                    string contentFileName = fileName[1];
                    //get website data file
                    WebSiteModel parseModel = WebSiteManager.GetSiteInfo(dataFileName);

                    //pase page
                    YongcheHtmlHelper yongche = new YongcheHtmlHelper();
                    string tempContent = System.IO.File.ReadAllText(contentFileName, Encoding.UTF8);
                    List<Article> articles = yongche.ParseArticle(tempContent, parseModel);


                    string result = JsonHelper.Serializer<List<Article>>(articles);

                    //TODO: save parse data

                    //move to backup path
                    FileInfo info = new FileInfo(contentFileName);
                    string parseRoot = "c:\\parse\\";
                    string parsePath = string.Format("{0}{1}\\", parseRoot, parseModel.SourceAddress.Host.Replace("."," "));
                    string backupFileName = string.Format("{0}{1}", parsePath, info.Name);

                    MovePaseFile(contentFileName, backupFileName);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(string.Format("error : {0}", ex.Message));
                    LogHelper.WriteLog(ex);
                }

                Thread.Sleep(100);
            }
        }

        private void MovePaseFile(string sourceFileName, string destFileName)
        {
            FileHelper.MoveTo(sourceFileName, destFileName);
        }

        #region IDisposable Members

        public void Dispose()
        {
            try
            {
                if (_receiveMSMQThread != null)
                {
                    _receiveMSMQThread.Abort();
                    _receiveMSMQThread.Join();
                    _receiveMSMQThread = null;
                }

                MSMQManager.InstanceLocalComputer.Dispose();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        #endregion
    }
}
