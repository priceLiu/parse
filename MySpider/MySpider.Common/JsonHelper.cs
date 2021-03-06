﻿using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;

namespace MySpider.Common
{
    public class JsonHelper
    {
        public static string Serializer<T>(T t)
        {
            return Serializer<T>(t, Formatting.Indented);
        }

        public static string Serializer<T>(T t, Formatting formatting)
        {
            return JsonConvert.SerializeObject(t, formatting);
        }

        public static T DeserializeSingle<T>(string jsonString)
        {
            return JsonConvert.DeserializeObject<T>(jsonString);
        }

        public static List<T> DeserializeObject<T>(string jsonString)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<List<T>>(jsonString);
        }
    }
}
