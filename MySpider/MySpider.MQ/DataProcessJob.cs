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
    public class DataProcessJob : SpiderQueue
    {
        private static readonly string queuePath = AppSetting.Value.MSMQ_DATA_PROCESS_QUEUE;
        private static int queueTimeout = 20;

        public DataProcessJob()
            : base(queuePath, queueTimeout)
        {
            queue.Formatter = new BinaryMessageFormatter();
        }

        public DataProcessJob(int timeoutSeconds, IMessageFormatter formatter)
            : base(queuePath, timeoutSeconds)
        {
            queue.Formatter = formatter;
        }

        public new DataProcessMsg Receive()
        {
            base.transactionType = MessageQueueTransactionType.Automatic;
            return (DataProcessMsg)((Message)base.Receive()).Body;
        }

        public void Send(DataProcessMsg dataProcessMsg)
        {
            base.transactionType = MessageQueueTransactionType.Single;
            base.Send(dataProcessMsg);
        }
    }
}
