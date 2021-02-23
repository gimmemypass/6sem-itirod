using System;
using System.Collections.Generic;
using System.Text;

namespace UdpChat
{
    public class PacketData
    {
        public enum DataIdentifier
        {
            LogIn,
            LogOut,
            Message,
            DataArrived, 
            DataIsBroken,
            Null
        };

//        private DataIdentifier _dataIdentifier;
//        private string _name;
//        private string _message;

        public DataIdentifier dataIdentifier { get; private set; }
        public string name { get; private set; } 
        public string message { get; private set; }
        public int date { get; private set; }  
        public int NameLength => name?.Length ?? 0;
        public int MessageLength => message?.Length ?? 0;
        public byte[] hash { get; private set; }

        public PacketData(DataIdentifier dataIdentifier, string name, string message)
        {
            this.dataIdentifier = dataIdentifier;
            this.name = name;
            this.message = message;
            this.date = (int) DateTime.UtcNow.Ticks;
        }

        public PacketData(byte[] data)
        {
            int offset = 0;
            dataIdentifier = (DataIdentifier) BitConverter.ToInt32(data, offset);
            offset += 4;
            var nameLength = BitConverter.ToInt32(data, offset);
            offset += 4;
            var messageLength = BitConverter.ToInt32(data, offset);
            offset += 4;
            name = nameLength > 0 ? Encoding.UTF8.GetString(data, offset, nameLength) : null;
            offset += nameLength;
            message = messageLength > 0 ? Encoding.UTF8.GetString(data, offset, messageLength) : null;
            offset += messageLength;
            date = BitConverter.ToInt32(data, offset);
            offset += 4;
            hash = new byte[16]; 
            Array.Copy(data, offset, hash, 0, 16);
        }

        public byte[] GetByteArray()
        {
            var data = new List<byte>();
            data.AddRange(GetUserDataBytes());
            data.AddRange(CalculateMD5(data.ToArray()));
            return data.ToArray();
        }
        private byte[] GetUserDataBytes()
        {
            var data = new List<byte>();
            data.AddRange(BitConverter.GetBytes((int)dataIdentifier));
            data.AddRange(BitConverter.GetBytes(NameLength));
            data.AddRange(BitConverter.GetBytes(MessageLength));
            if(name != null)
                data.AddRange(Encoding.UTF8.GetBytes(name));
            if(message != null)
                data.AddRange(Encoding.UTF8.GetBytes(message));
            data.AddRange(BitConverter.GetBytes(date));
            return data.ToArray();
        }
        
        private static byte[] CalculateMD5(byte[] bytes)
        {
            byte[] hash;
            using (var md5 = System.Security.Cryptography.MD5.Create())
            {
                md5.TransformFinalBlock(bytes, 0, bytes.Length);
                hash = md5.Hash;
            }

            return hash;
        }

        public byte[] CalculateMD5()
        {
            var bytes = GetUserDataBytes();
            return CalculateMD5(bytes);
        }
    }
}