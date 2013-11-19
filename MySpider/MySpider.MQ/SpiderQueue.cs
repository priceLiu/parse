using System;
using System.Collections.Generic;
using System.Linq;
using System.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.MQ
{
    public class SpiderQueue : IDisposable
    {
        protected MessageQueueTransactionType transactionType = MessageQueueTransactionType.Automatic;
        protected MessageQueue queue;
        protected TimeSpan timeout;

        public SpiderQueue(string queuePath, int timeoutSeconds)
        {
            CreateQueue(queuePath);
            queue = new MessageQueue(queuePath);
            timeout = TimeSpan.FromSeconds(timeoutSeconds);

            if (timeoutSeconds == -1)
            {
                timeout = TimeSpan.MinValue;
            }

            queue.DefaultPropertiesToSend.AttachSenderId = false;
            queue.DefaultPropertiesToSend.UseAuthentication = false;
            queue.DefaultPropertiesToSend.UseEncryption = false;
            queue.DefaultPropertiesToSend.AcknowledgeType = AcknowledgeTypes.None;
            queue.DefaultPropertiesToSend.UseJournalQueue = false;
        }

        public virtual object Receive()
        {
            try
            {
                Message message;

                if (timeout == TimeSpan.MinValue)
                {
                    using (message = queue.Receive(transactionType))
                    {
                        return message;
                    }
                }
                else
                {
                    using (message = queue.Receive(timeout, transactionType))
                    {
                        return message;
                    }
                }
            }
            catch (MessageQueueException mqex)
            {
                if (mqex.MessageQueueErrorCode == MessageQueueErrorCode.IOTimeout)
                {
                    throw new TimeoutException();
                }

                throw;
            }
        }

        public virtual void Send(object msg)
        {
            queue.Send(msg, transactionType);
        }

        private void CreateQueue(string queuePath)
        {
            try
            {
                if (!MessageQueue.Exists(queuePath))
                {
                    MessageQueue.Create(queuePath, true);
                }
            }
            catch (MessageQueueException e)
            {
                throw e;
            }
        }

        public void Dispose()
        {
            queue.Dispose();
        }
    }
}
