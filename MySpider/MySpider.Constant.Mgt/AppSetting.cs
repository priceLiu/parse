using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Constant.Mgt
{
    public class AppSetting
    {
        class Key
        {
            public const string READY_ROOT = "readyRoot";
            public const string PARSE_ROOT = "parseRoot";
            public const string FINISHED_PATH = "finishedPath";
            public const string MSMQ_NAME = "msmqName";
            public const string RESULT_ROOT = "resultRoot";
            public const string MSMQ_CRAWL_QUEUE = "crawlqueue";
            public const string MSMQ_DATA_PROCESS_QUEUE = "dataProcessQueue";
        }

        public class Value
        {
            public static string ReadyRoot = ConfigurationManager.AppSettings[Key.RESULT_ROOT].ToString();
            public static string ParseRoot = ConfigurationManager.AppSettings[Key.PARSE_ROOT].ToString();
            public static string FinishedPath = ConfigurationManager.AppSettings[Key.FINISHED_PATH].ToString();
            public static string MSMQName = ConfigurationManager.AppSettings[Key.MSMQ_NAME].ToString();
            public static string MSMQ_CRAWL_QUEUE = ConfigurationManager.AppSettings[Key.MSMQ_CRAWL_QUEUE].ToString();
            public static string ResultRoot = ConfigurationManager.AppSettings[Key.RESULT_ROOT].ToString();
            public static string MSMQ_DATA_PROCESS_QUEUE = ConfigurationManager.AppSettings[Key.MSMQ_DATA_PROCESS_QUEUE].ToString();
        }
    }
}
