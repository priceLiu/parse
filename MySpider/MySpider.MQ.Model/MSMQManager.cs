﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Messaging;
using System.Configuration;
using System.Diagnostics;
using System.Transactions;
using MySpider.Constant.Mgt;

namespace MySpider.MQ.Model
{    
    /// <summary>
    /// 消息队列管理器
    /// 作者：心海巨澜 xinhaijulan@gmail.com
    /// </summary>
    public class MSMQManager : IDisposable
    {
        #region 字段与属性
        private MessageQueue _msmq = null;
        private string _path;
        private string msmqName = AppSetting.Value.MSMQName;

        private static MSMQManager _instanceLocalComputer = new MSMQManager(true);
        /// <summary>
        /// 本机消息队列实例
        /// </summary>
        public static MSMQManager InstanceLocalComputer
        {
            get { return MSMQManager._instanceLocalComputer; }
        }

        private static MSMQManager _instance = new MSMQManager(false);
        /// <summary>
        /// 远程消息队列实例
        /// </summary>
        public static MSMQManager Instance
        {
            get { return MSMQManager._instance; }
        }
        #endregion

        /// <summary>
        /// 创建队列
        /// </summary>
        /// <param name="transactional">是否启用事务</param>
        /// <returns></returns>
        public bool Create(bool transactional)
        {
            if (MessageQueue.Exists(msmqName))
            {
                return true;
            }
            else
            {
                if (MessageQueue.Create(msmqName, transactional) != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        /// <summary>
        /// 实例化消息队列
        /// </summary>
        /// <param name="isLocalComputer">是否为本机</param>
        public MSMQManager(bool isLocalComputer)
        {
            if (isLocalComputer)
            {
                _path = msmqName;
            }
            else
            {
                _path = @"FormatName:DIRECT=TCP:192.168.0.244" + msmqName;
            }

            _msmq = new MessageQueue(_path);
        }

        /// <summary>
        /// 发送消息队列
        /// </summary>
        /// <param name="msmqIndex">消息队列实体</param>
        /// <returns></returns>
        public void Send(MSMQIndex msmqIndex)
        {
            _msmq.Send(new Message(msmqIndex, new BinaryMessageFormatter()));
        }

        public void Send<T>(T msmqContent, IMessageFormatter messageFormatter)
        {
            _msmq.Send(new Message(msmqContent, messageFormatter));
        }

        /// <summary>
        /// 接收消息队列,删除队列
        /// </summary>
        /// <returns></returns>
        public MSMQIndex ReceiveAndRemove()
        {
            MSMQIndex msmqIndex = null;
            _msmq.Formatter = new BinaryMessageFormatter();
            Message msg = null;
            try
            {
                //msg = _msmq.Receive(new TimeSpan(0, 0, 1));
                msg = _msmq.Receive();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            if (msg != null)
            {
                msmqIndex = msg.Body as MSMQIndex;
            }
            return msmqIndex;
        }

        public object ReceiveBinaryMsg()
        {
            object obj = null;

            _msmq.Formatter = new BinaryMessageFormatter();
            Message msg = null;

            try
            {
                msg = _msmq.Receive();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            if (msg != null)
            {
                obj = msg.Body as object;
            }

            return obj;
        }

        #region IDisposable Members

        public void Dispose()
        {
            if (_msmq != null)
            {
                _msmq.Close();
                _msmq.Dispose();
                _msmq = null;
            }
        }

        #endregion
    }
}
