using MySpider.Constant.Mgt;
using System;
using System.IO;
using System.Text;

namespace MySpider.Common
{
    public class FileHelper
    {
        public const string RESULT_FILE_EXTENSION = ".result";
        public const string DOWNLOAD_FILE_EXTENSION = ".html";
        public const string DATA_EXTENSION = ".data";

        public static string ResultRoot = AppSetting.Value.ResultRoot;
        public static string ParseRoot = AppSetting.Value.ParseRoot;
        public static string ReadyRoot = AppSetting.Value.ReadyRoot;

        public static string ReadAllText(string targetPath, Encoding encoding)
        {
            return System.IO.File.ReadAllText(targetPath, encoding);
        }

        public static bool WriteTo(string content, string targetPath)
        {
            bool isSuccess = false;

            try
            {
                FileInfo myFile = new FileInfo(targetPath);

                StreamWriter sw = myFile.CreateText();
                sw.Write(content);
                sw.Close();

                isSuccess = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return isSuccess;
        }

        public static string GenerateFileName(string url)
        {
            Uri uri = new Uri(url);
            string fileName = string.Format("{0}{1}", uri.Host, 
                                string.IsNullOrEmpty(uri.LocalPath) ? string.Empty : string.Format("{0}", uri.LocalPath.Replace("/", " ")));
            
            return fileName;
        }

        public static void MoveTo(string sourceFileName, string destFileName)
        {
            FileInfo info = new FileInfo(destFileName);
            CreateDirectory(info.Directory.ToString());

            try
            {
                File.Move(sourceFileName, destFileName);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static void CreateDirectory(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        public static string WriteToResultFile(string content, string sourceFileName)
        {
            return string.Empty;
        }

        public static string GenerateResultFileName(string fileName)
        {
            FileInfo info = new FileInfo(fileName);
            string tmp = info.Name.Remove(info.Name.Length - info.Extension.Length);

            return string.Format("{0}{1}", tmp, FileHelper.RESULT_FILE_EXTENSION);
        }

        public static string GenerateBackupFileName(string fileName, Uri sourceAddress)
        {
            FileInfo info = new FileInfo(fileName);
            string parsePath = string.Format("{0}{1}\\", FileHelper.ParseRoot, sourceAddress.Host.Replace(".", " "));
            return string.Format("{0}{1}", parsePath, info.Name);
        }

        public static string GenerateResultPath(Uri sourceAddress)
        {
            return string.Format("{0}{1}\\", FileHelper.ResultRoot, sourceAddress.Host.Replace(".", " "));
        }
    }
}
