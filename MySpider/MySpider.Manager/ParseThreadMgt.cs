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
using MySpider.MQ;

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

        public string MSMQName = AppSetting.Value.MSMQ_CRAWL_QUEUE;

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
            _receiveMSMQThread.Name = "ReceiveCrawlThread";
            _receiveMSMQThread.IsBackground = true;
            _receiveMSMQThread.Start();
        }

        public void ReceiveMSMQ()
        {
            ReceiveMSMQ(-1, new BinaryMessageFormatter());
        }

        public void ReceiveMSMQ(int timeoutSeconds, IMessageFormatter formatter)
        {
            CrawlJob job;

            if (timeoutSeconds == -1)
            {
                job = new CrawlJob(timeoutSeconds, formatter);
            }
            else
            {
                job = new CrawlJob();
            }

            while (true)
            {
                MSMQMsg obj = null;

                try
                {
                    obj = job.Receive() as MSMQMsg;

                    if (obj == null)
                    {
                        throw new NullReferenceException();
                    }

                    string dataFileName = obj.RuleFileName;
                    string contentFileName = obj.DownloadedFileName;

                    //get website data file
                    WebSiteModel parseModel = WebSiteManager.GetSiteInfo(dataFileName);

                    //pase page
                    YongcheHtmlHelper yongche = new YongcheHtmlHelper();
                    string tempContent = System.IO.File.ReadAllText(contentFileName, Encoding.UTF8);
                    List<Article> articles = yongche.ParseArticle(tempContent, parseModel);

                    string resultPath = FileHelper.GenerateResultPath(parseModel.SourceAddress);
                    FileHelper.CreateDirectory(resultPath);
                    string resultFileName = FileHelper.GenerateResultFileName(contentFileName);
                    string tmpName = string.Format("{0}\\{1}", resultPath, resultFileName);

                    string result = JsonHelper.Serializer<List<Article>>(articles);
                    bool isSuccess = FileHelper.WriteTo(result, tmpName);

                    //move to backup path
                    if (isSuccess)
                    {
                        string backupFileName = FileHelper.GenerateBackupFileName(contentFileName, parseModel.SourceAddress);
                        MovePaseFile(contentFileName, backupFileName);

                        DataProcessMsg processMsg = new DataProcessMsg();
                        processMsg.Path = tmpName;
                        processMsg.SourceFileName = backupFileName;

                        SendToDataProcess(processMsg);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(string.Format("error : {0}", ex.Message));
                    LogHelper.WriteLog(string.Format("{0}; \r\n {1} msg = {2}", ex, Environment.NewLine, obj.ToString()));
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

        private void SendToDataProcess(DataProcessMsg msg)
        {
            DataProcessJob process = new DataProcessJob();
            process.Send(msg);
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
