using MySpider.MQ.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Send.Sample
{
    class Program
    {
        static void Main(string[] args)
        {
            MSMQIndex mqIndex = new MSMQIndex();
            mqIndex.IndexName = "IndexName";
            List<int> list = new List<int>();

            Console.WriteLine("quit为退出,回车发送消息");
            string receiveKey = Console.ReadLine();

            while (receiveKey.ToLower() != "quit")
            {
                try
                {
                    //mqIndex.IndexName = "大家好，不错，呵呵！~ " + DateTime.Now.ToString();

                    //list.Clear();
                    //int i = 0;
                    //Random random = new Random();
                    //while (i++ < 3)
                    //{
                    //list.Add(random.Next(i, 10000));
                    //}

                    //int tmp  = Convert.ToInt32(Console.ReadLine());

                    //list.Add(tmp);
                    //mqIndex.Item.Clear();
                    //mqIndex.Item.Add(CommandType.Create, list);

                    //MSMQManager.InstanceLocalComputer.Send(mqIndex);

                    MSMQManager.InstanceLocalComputer.Send<string>(receiveKey, new BinaryMessageFormatter());
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    LogHelper.WriteLog(ex);
                }

                Console.WriteLine("quit为退出,回车发送消息");
                receiveKey = Console.ReadLine();
            }

            MSMQManager.InstanceLocalComputer.Dispose();
        }
    }
}