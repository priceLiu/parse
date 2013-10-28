using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using MySpider.MQ.Model;

namespace MySpider.Receive.Sample
{
    /// <summary>
    /// 接收消息队列线程管理
    /// 作者：心海巨澜 xinhaijulan@gmail.com
    /// </summary>
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
            //MSMQIndex mqIndex = null;
            object obj = null;

            //it is transactional
            MSMQManager.InstanceLocalComputer.Create(true);
            
            while (true)
            {
                try
                {
                    /*mqIndex = MSMQManager.InstanceLocalComputer.ReceiveAndRemove();
                    if (mqIndex != null)
                    {
                        Console.WriteLine("IndexName：" + mqIndex.IndexName);
                        List<int> list = mqIndex.Item[CommandType.Create] as List<int>;
                        Console.WriteLine("CommandType：" + CommandType.Create);
                        Console.WriteLine("--------------------------begin-------------------------------");
                        for (int i = 0; i < list.Count; ++i)
                        {
                            Console.WriteLine(i + "：【" + list[i].ToString() + "】 " + DateTime.Now.ToString());
                        }
                        Console.WriteLine("--------------------------end---------------------------------");
                    }*/

                    obj = MSMQManager.InstanceLocalComputer.ReceiveBinaryMsg();
                    Console.WriteLine(obj.ToString());
                }
                catch(Exception ex)
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
