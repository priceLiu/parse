using System;
using System.Collections.Generic;
using System.Text;
using System.Configuration;
using System.IO;

namespace MySpider.MQ.Model
{
    /// <summary>
    /// 日志Helper
    /// 作者：心海巨澜 xinhaijulan@gmail.com
    /// </summary>
    public static class LogHelper
    {
        private static string SysErrLogSavePath = ConfigurationManager.AppSettings["SysErrLogSavePath"] ?? AppDomain.CurrentDomain.BaseDirectory;

        /// <summary>
        /// 在默认位置记录异常日志
        /// </summary>
        /// <param name="ex">异常</param>
        public static void WriteLog(Exception ex)
        {
            WriteLog(getErrMsg(ex));
        }

        /// <summary>
        /// 在指定位置写日志
        /// </summary>
        /// <param name="message">日志内容</param>
        public static void WriteLog(string message)
        {
            WriteLog(SysErrLogSavePath, message);
        }

        /// <summary>
        /// 记录log日志
        /// </summary>
        /// <param name="filename">文件路径，硬盘地址</param>
        /// <param name="str">要写入的内容</param>
        public static void WriteLog(string filepath, string str)
        {
            try
            {
                if (!Directory.Exists(filepath)) Directory.CreateDirectory(filepath);
                string filename = DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
                using (StreamWriter sw = new StreamWriter(filepath + "\\" + filename, true))
                {
                    sw.WriteLine("--------------------------------------------");
                    sw.WriteLine("{0}:{1}\t{2}", DateTime.Now.ToLongTimeString(), DateTime.Now.Millisecond, str);
                    sw.Close();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(getErrMsg(e));
                //文本日志记录失败
            }
        }

        /// <summary>
        /// 获取错误详细信息。
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        private static string getErrMsg(Exception ex)
        {
            string errMessage = "";
            for (Exception tempException = ex; tempException != null; tempException = tempException.InnerException)
            {
                errMessage += tempException.Message + Environment.NewLine + Environment.NewLine;
            }
            errMessage += ex.ToString();
            return errMessage;
        }
    }
}
