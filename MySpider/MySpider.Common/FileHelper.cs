using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MySpider.Common
{
    public class FileHelper
    {
        public string ReadAllText(string targetPath, Encoding encoding)
        {
            return System.IO.File.ReadAllText(targetPath, encoding);
        }

        public static bool WriteTo(string content, string targetPath)
        {
            try
            {
                FileInfo myFile = new FileInfo(targetPath);
                StreamWriter sw = myFile.CreateText();

                sw.Write(content);
                sw.Close();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
