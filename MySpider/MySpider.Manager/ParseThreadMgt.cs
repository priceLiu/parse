using MySpider.Model;
using MySpider.Model.Manager;
using MySpider.MQ.Model;
using ParseMachine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MySpider.Manager
{
    public class ThreadManager : IDisposable
    {
        private Thread _receiveMSMQThread = null;

        private static ThreadManager _instance = new ThreadManager();
        /// <summary>
        /// 初始化
        /// </summary>
        public static ThreadManager Instance
        {
            get { return ThreadManager._instance; }
            set { ThreadManager._instance = value; }
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
            _receiveMSMQThread.Name = "ReceiveMSMQThread";
            _receiveMSMQThread.IsBackground = true;
            _receiveMSMQThread.Start();
        }

        private void ReceiveMSMQ()
        {
            object obj = null;
            MSMQManager.InstanceLocalComputer.Create(true);

            while (true)
            {
                try
                {
                    obj = MSMQManager.InstanceLocalComputer.ReceiveBinaryMsg();
                    string [] fileName = obj.ToString().Split(','); // file[0] data path,  file[1] html path

                    //get website data file
                    WebSiteModel parseModel = WebSiteManager.GetSiteInfo(fileName[0]);

                    //pase page
                    YongcheHtmlHelper yongche = new YongcheHtmlHelper();
                    string tempContent = System.IO.File.ReadAllText(fileName[1], Encoding.Default);
                    List<Article> articles = yongche.ParseArticle(tempContent, parseModel);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(string.Format("error : {0}", ex.Message));
                    LogHelper.WriteLog(ex);
                }

                Thread.Sleep(100);
            }
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
