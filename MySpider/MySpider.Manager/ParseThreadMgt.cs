using MySpider.Common;
using MySpider.Model;
using MySpider.Model.Manager;
using MySpider.MQ.Model;
using ParseMachine;
using System;
using System.Collections.Generic;
using System.IO;
using System.Messaging;
using System.Text;
using System.Threading;
using MySpider.Constant.Mgt;

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

        public string MSMQName = AppSetting.Value.MSMQName;

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
            MSMQManager.InstanceLocalComputer.Create(false);

            while (true)
            {
                MSMQMsg obj = null;

                try
                {
                    obj = MSMQManager.InstanceLocalComputer.ReceiveBinaryMsg() as MSMQMsg;

                    string dataFileName = obj.RuleFileName;
                    string contentFileName = obj.DownloadedFileName;
                    //get website data file
                    WebSiteModel parseModel = WebSiteManager.GetSiteInfo(dataFileName);

                    //pase page
                    YongcheHtmlHelper yongche = new YongcheHtmlHelper();
                    string tempContent = System.IO.File.ReadAllText(contentFileName, Encoding.UTF8);
                    List<Article> articles = yongche.ParseArticle(tempContent, parseModel);

                    string result = JsonHelper.Serializer<List<Article>>(articles);

                    FileInfo info = new FileInfo(contentFileName);
                    string resultPath = FileHelper.GenerateResultPath(parseModel.SourceAddress);
                    
                    FileHelper.CreateDirectory(resultPath);
                    
                    string resultFileName = FileHelper.GenerateResultFileName(contentFileName);
                    bool isSuccess = FileHelper.WriteTo(result, string.Format("{0}\\{1}", resultPath, resultFileName));

                    //move to backup path
                    if (isSuccess)
                    {
                        string backupFileName = FileHelper.GenerateBackupFileName(contentFileName, parseModel.SourceAddress);
                        MovePaseFile(contentFileName, backupFileName);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(string.Format("error : {0}", ex.Message));
                    LogHelper.WriteLog(string.Format("{0}; \r\n {1} msg = {2}", ex , Environment.NewLine, obj.ToString()));
                }

                Thread.Sleep(100);
            }
        }

        public void ReceiveMSMQByTransaction()
        {
            while (true)
            {
                try
                {
                    using (MessageQueueTransaction transaction = new MessageQueueTransaction())
                    {
                        using (MessageQueue someQueue = MessageQueue.Create(MSMQName, true))
                        {
                            someQueue.Formatter = new BinaryMessageFormatter();
                            Message msg = someQueue.Receive(transaction);
                            object t = msg.Body;

                            string[] fileName = t.ToString().Split(','); // file[0] data path,  file[1] html path

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
                            string parsePath = string.Format("{0}{1}\\", FileHelper.ParseRoot, parseModel.SourceAddress.Host.Replace(".", " "));
                            string backupFileName = string.Format("{0}{1}", parsePath, info.Name);

                            MovePaseFile(contentFileName, backupFileName);
                        }

                        transaction.Commit();
                    }
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
