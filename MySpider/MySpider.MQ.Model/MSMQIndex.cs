using System;
using System.Collections.Generic;
using System.Text;

namespace MySpider.MQ.Model
{
    /// <summary>
    /// 索引消息队列实体
    /// 作者：心海巨澜 xinhaijulan@gmail.com
    /// </summary>
    [Serializable]
    public class MSMQIndex
    {
        private string _indexName;
        private Dictionary<CommandType, List<int>> _item = new Dictionary<CommandType, List<int>>();

        /// <summary>
        /// 索引数据，CommandType为操作类型，List<int>为操作的主键列表
        /// </summary>
        public Dictionary<CommandType, List<int>> Item
        {
            get { return _item; }
            set { _item = value; }
        }

        /// <summary>
        /// 索引名称
        /// </summary>
        public string IndexName
        {
            get { return _indexName; }
            set { _indexName = value; }
        }

        /// <summary>
        /// 无参构造函数
        /// </summary>
        public MSMQIndex()
        { 
        }

        /// <summary>
        /// 传参构造函数
        /// </summary>
        /// <param name="indexName">索引名称</param>
        /// <param name="item">索引数据，CommandType为操作类型，List<int>为操作的主键列表</param>
        public MSMQIndex(string indexName, Dictionary<CommandType, List<int>> item)
        {
            _indexName = indexName;
            _item = item;
        }
    }

    /// <summary>
    /// 操作类型
    /// </summary>
    public enum CommandType
    { 
        /// <summary>
        /// 创建
        /// </summary>
        Create = 1,
        /// <summary>
        /// 更新
        /// </summary>
        Update = 2,
        /// <summary>
        /// 删除
        /// </summary>
        Delete =3
    }
}
