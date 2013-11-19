using MySpider.Constant.Mgt;
using MySpider.MQ.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.MQ
{
    public class CrawlJob : SpiderQueue
    {
        private static readonly string queuePath = AppSetting.Value.MSMQ_CRAWL_QUEUE;
        private static int queueTimeout = 20;

        public CrawlJob()
            : base(queuePath, queueTimeout)
        {
            queue.Formatter = new BinaryMessageFormatter();
        }

        public CrawlJob(int timeoutSeconds, IMessageFormatter formatter)
            : base(queuePath, timeoutSeconds)
        {
            queue.Formatter = formatter;
        }

        public new MSMQMsg Receive()
        {
            base.transactionType = MessageQueueTransactionType.Automatic;
            return (MSMQMsg)((Message)base.Receive()).Body;
        }

        public void Send(MSMQMsg crawlMessage)
        {
            base.transactionType = MessageQueueTransactionType.Single;
            base.Send(crawlMessage);
        }
    }
}
