using MySpider.MQ;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Transactions;

namespace MySpider.Manager
{
    public class DataWarehouseManager
    {
        public void Start()
        {
            Thread workTicketThread;
            int threadCount = 5;
            Thread[] workerThreads = new Thread[threadCount];

            for (int i = 0; i < threadCount; i++)
            {
                //创建 Thread 实例 
                workTicketThread = new Thread(new ThreadStart(ProcessData));

                // 设置线程在后台工作和线程启动前的单元状态（STA表示将创建并进入一个单线程单元 ）
                workTicketThread.IsBackground = true;
                workTicketThread.SetApartmentState(ApartmentState.STA);

                //启动线程，将调用ThreadStart委托
                workTicketThread.Start();
                workerThreads[i] = workTicketThread;
            }

        }

        private void ProcessData()
        {
            int transactionTimeout = 20;
            int queueTimeout = 30;

            DataProcessJob dataJob = new DataProcessJob();
            int batchSize = dataJob.MessageCounts;
            // 总事务处理时间（tsTimeout ）就该超过批处理任务消息的总时间
            TimeSpan tsTimeout = TimeSpan.FromSeconds(Convert.ToDouble(transactionTimeout * batchSize));

            while (true)
            {
                // 消息队列花费时间
                TimeSpan datetimeStarting = new TimeSpan(DateTime.Now.Ticks);
                double elapsedTime = 0;
                ArrayList queueOrders = new ArrayList();

                using (TransactionScope ts = new TransactionScope(TransactionScopeOption.Required, tsTimeout))
                {
                    // 接收来自消息队列的任务消息
                    for (int j = 0; j < batchSize; j++)
                    {
                        try
                        {
                            //如果有足够的时间，那么接收任务，并将任务存储在数组中 
                            if ((elapsedTime + queueTimeout + transactionTimeout) < tsTimeout.TotalSeconds)
                            {
                                queueOrders.Add(dataJob.Receive());
                            }
                            else
                            {
                                j = batchSize;   // 结束循环
                            }

                            //更新已占用时间
                            elapsedTime = new TimeSpan(DateTime.Now.Ticks).TotalSeconds - datetimeStarting.TotalSeconds;
                        }
                        catch (TimeoutException)
                        {

                            //结束循环因为没有可等待的任务消息
                            j = batchSize;
                        }
                    }

                    //从数组中循环取出任务对象，并将任务插入到数据库中
                    /*for (int k = 0; k < queueOrders.Count; k++)
                    {
                        SearchHelper sh = new SearchHelper();
                        sh.IndexOn((IndexJob)queueOrders[k]);
                        processedItems++;
                        totalOrdersProcessed++;
                    }*/

                    //指示范围中的所有操作都已成功完成
                    ts.Complete();
                }
                //完成后显示处理信息
                //logger.Debug("(线程 Id " + Thread.CurrentThread.ManagedThreadId + ") 批处理完成, " + processedItems + " 任务, 处理花费时间： " + elapsedTime.ToString() + " 秒.");
            }
        }
    }
}
