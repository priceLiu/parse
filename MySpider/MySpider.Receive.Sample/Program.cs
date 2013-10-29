using MySpider.Manager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Receive.Sample
{
    class Program
    {
        static void Main(string[] args)
        {
           //ThreadManager.Instance.Start();


            ParseThreadMgt.Instance.Start();
            Console.WriteLine("quit为退出");
            string receiveKey = Console.ReadLine();
            while (receiveKey.ToLower() != "quit")
            {
                receiveKey = Console.ReadLine();
            }
            ParseThreadMgt.Instance.Stop();
            Console.Read();
        }
    }
}